<template>
	<div style="padding: 0;">
		<BreadList :list="['救援工单管理','事故信息管理']"/>
		<a-card>
			<!-- 搜索框：根据设备名称查询-->
			<div class="search-group" style="margin-top: 0!important;">
				<div class="increased" style="float: left ;">
					<a-button style="margin-top: 0!important;text-align: center;" type="primary" icon="plus"
						@click="handleAccidentAdd">
						新增
					</a-button>
				</div>
				<div class="search-item" style="float: left;">
					<span class="search-text">事故联系人姓名:</span>
					<a-input v-model="page.params.cusName" type="text" placeholder="可根据事故联系人姓名查询" />
				</div>
				<div class="search-item" style="float: left;">
					<span class="search-text">事故联系人电话号码:</span>
					<a-input v-model="page.params.cusTel" type="text" placeholder="可根据联系方式查询" />
				</div>
				<div class="search-item">
					<!-- 搜索按钮 -->
					<a-button style="margin-top: 0!important;" type="primary" icon="search" @click="searchBySelect">
						查询
					</a-button>
					<a-button type="primary" icon="search" style="margin-top: 0!important; float: right" @click="getnodistribute(page)">待分配事故</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
			<!-- 表格 table -->
			<a-table rowKey="accId" :columns="columns" :pagination="false" :data-source="page.list" bordered
				:scroll="{ x: 1500, y: 560 }">
				<template slot="orderId" slot-scope="orderId">
					<span v-if="orderId!==null" @click="gotoOrder()" >
						{{orderId}}
					</span>
				</template>
				<template slot="accDate" slot-scope="text, record">
						{{ record.accDate | formatDate }}
				</template>

				<template slot="operation" slot-scope="text, record">
					<a-space>
						<a-button type="primary"   	:disabled="record.orderId !== null ? true : false"  @click="distribute(record.accId)">
							{{record.orderId !== null ? "已分配服务点" : "分配服务点"}}
						</a-button>
						<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了"
							@confirm="handleAccidentDelete(record.accId)">
							<a-button type="danger"> 删 除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
			<br />
			<!-- 表格 table 结束 -->
			<a-button type="primary" style="float:left;margin-top: 15px;">总条数：{{ page.totalCount }}</a-button><a-pagination
				v-model="page.currentPage" :page-size-options="['5', '10', '20', '50']" :total="page.totalCount"
				show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
			</a-pagination>
			<div>

				<a-modal :footer="null" @cancel="cancel()" :visible="visible" >
					<!-- 新增事故信息的表单 -->
					<h2 style="margin-bottom: 5px;font-size: 20px;">{{ editStatus === false ? "添加" : "修改" }}</h2>
					<a-form-model style="height: 200px;" ref="ruleForm" :model="editAccidentInfo" :rules="rules"
						:label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
						<!-- 设备名称 -->
						<a-form-model-item ref="cusName" label="事故联系人姓名" prop="cusName"  >
							<a-input v-model="editAccidentInfo.cusName" placeholder="请输入事故联系人姓名" />
						</a-form-model-item>
						<a-form-model-item ref="cusTel"  label="事故联系人电话" prop="cusTel" >
							<a-input v-model="editAccidentInfo.cusTel" placeholder="请输入11位电话号码"/>
						</a-form-model-item>
						<a-form-model-item ref="carType"  label="事故车型" prop="carType" >
							<a-input v-model="editAccidentInfo.carType" placeholder="请输入事故车型" />
						</a-form-model-item>
						<a-form-model-item ref="describe" label="事故原因描述" prop="describe" >
							<a-input v-model="editAccidentInfo.describe" placeholder="请输入事故原因描述"/>
						</a-form-model-item>
						<!-- <a-form-model-item ref="accDate" label="事故发生时间" prop="accDate" >
							<a-input v-model="editAccidentInfo.accDate" placeholder="请输入事故发生时间"/>
						</a-form-model-item> -->
						<a-form-model-item ref="location" label="事故发生地址" prop="location"    >
							<a-input v-model="editAccidentInfo.location" placeholder="请输入事故发生地址"/>
						</a-form-model-item>
						<a-form-model-item style="margin-left: 35%;" class="form-btn">
							<a-button @click="submit" type="primary">提交</a-button>
							<a-button style="margin-left: 20px" @click="cancel">取消</a-button>
						</a-form-model-item>
					</a-form-model>
				</a-modal>
			</div>
		</a-card>
	</div>
</template>

<script>
const formItemLayout = {
	labelCol: {
		span:8
	},
	wrapperCol: {
		span: 14
	},
};
import { format } from "date-fns";
// column 列封装
import {
	getAccidentList,
	deleleteById,
	updateStatus,
	addAccidentInfo,
	getDistribute,
	noDistribute,
	// getDistribute
	// distribute,
} from "@/api/Accident.js";
import {
	SendMessage
} from "@/api/user.js";
import {
	getPicById
} from "@/api/scenePic.js";

import {
	AccidentColumns as columns
} from "@/assets/js/columns/StandBook.js";
// import XLSX from "xlsx";
export default {
	name: "AccidentList",
	data() {
		return {
			formItemLayout,
			loading: true,
			// 搜索栏目
			confirmLoading: true,
			page: {
				currentPage: 1, // 当前页
				pageSize: 5, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {
				}, // 查询参数对象
				list: [], // 数据
				sortColumn: "", // 排序列
				sortMethod: "", // 排序方式
			},
			editAccidentInfo: {
				cusName: "",
				cusTel: "",
				carType: "",
				describe:"",
				accDate: "",
				location: "",
			},
			rules: {
					cusName: [
						{
							required: true,
							message: "请输入事故联系人姓名",
							trigger: "blur",
						},
						{ min: 2, max: 5, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blue' },
					],
					cusTel: [
						{
							required: true,
							message: "请输入事故联系人电话",
							trigger: "blur",
						},
						{
							pattern: /^1[0-9]{10}$/, // 以1开头，后面跟10位数字
							message: '请输入有效的电话号码',
							trigger: 'blur',
						},
					],
					carType: [
						{
							required: true,
							message: "请输入事故车型",
							trigger: "blur",
						},
					],
					describe: [
						{
							required: true,
							message: "请输入事故描述",
							trigger: "blur",
						},
					],
					accDate: [
						{
							type: "date", // Assume date input
							required: true,
							message: "请输入事故发生时间YYYY-MM-DD",
							trigger: "blur",
						},
					],
					location: [
						{
							required: true,
							message: "请输入事故发生地坐标，例如 (1,2)",
							trigger: "blur",
						},
						{
							pattern: /\(\d+,\d+\)/, // Regex to match coordinates like (1,2)
							message: "请输入正确的坐标格式，例如 (1,2)",
							trigger: "blur",
						},
					],
				},
			iconLoading: false,// 控制按钮加载状态的标志位
			finished:false,//控制加载结束的标志位
			//列名的数组
			columns: [],
			uploadDialogVisible: false,
			uploading: false,
			visible: false,
			pics: [],
			AccidentInfo: {},
			conuts: 0,
			flag: true,
      editStatus:false,
			// uploadUrl: "http://121.196.166.190/api/v1/private/oss/upload?OrginazationId=",
		};
	},

	created() {
		this.columns = columns;
		this.getAccidentList();
		this.$message.success("查询成功");
	},
	mounted() {
		const mileId = this.$route.query.mileId;
		if (mileId != null) {
			this.page.params.mileagePile = mileId;
		}
		this.getAccidentList();
	},
	filters: {
			formatDate(timestamp) {
			const date = new Date(timestamp);
			console.log(timestamp);
			return format(date, "yyyy-MM-dd HH:mm:ss");
			},
	},
	methods: 
	{
		async getnodistribute(page){
			const {data: res} = await noDistribute(page);
			// this.$refs.table.refresh();
			console.log(res);
			this.page.list = res.data.list;
			this.page.totalCount = res.data.totalCount;
		},
			//Add
			handleAccidentAdd() {
			this.editAccidentInfo = {};
			this.editStatus = false;
			this.showModal();
		},
		showModal() {
			this.visible = true;
		},
		gotoOrder(){
			// this.$router.push('/toHome?id=202')
			this.$router.push('/standbook/order')
		},
		//分配服务点
		async distribute(accId){
			const res = await getDistribute(accId);
			console.log(accId);
			console.log(res.data)
			console.log(res.data.code)

			if(res.data.code === 20010){
				console.log('所有服务点忙碌中');
            this.$message.error('所有服务点忙碌中,分配失败')
			}
			else if (res.data.code !== 20000) {
            this.$message.error('分配失败');
			}
			else{
			console.log('分配成功');
            this.$message.success('分配成功');
			}
			this.getAccidentList();
		},
			//新增或者修改
		async submit() {
			this.$refs.ruleForm.validate(async (valid) => {
				if (valid) {
					if (!this.editStatus) {
						const {
							data: res
						} = await addAccidentInfo(this.editAccidentInfo);
						if (res.code !== 20000)
							return this.$message.success('添加出错')
						this.$message.success(res.msg)
					}
					this.visible = false;
					this.getAccidentList();
				} else {
					console.log("error submit!!");
					this.$message.success("error submit!!");
					return false;
				}

			});

		},
		async sendMessage() {
			const {
				data: res
			} = await SendMessage(this.AccidentInfo);
			this.$message.success(res.msg);
			this.getAccidentList();
			// this.handlePause();
		},
		async changeStatus() {
			this.AccidentInfo.status = 1;
			const {
				data: res
			} = await updateStatus(this.AccidentInfo);
			this.$message.success(res.msg);
			this.sendMessage();
			this.getAccidentList();
			this.handlePause();
			// this.$route.push();
		},
		async getPicList(AccidentId) {
			const {
				data: res
			} = await getPicById(AccidentId);
			this.pics = res.data;
			this.$message.success(res.msg);
		},
		cancel() {
			this.visible = false
			this.getAccidentList()
		},
		showPic(info) {
			this.AccidentInfo = info
			this.visible = true
			this.getPicList(info.AccidentId);
		},
		searchBySelect() {
			this.getAccidentList();
		},
		onPageChange(newPage) {
			this.page.currentPage = newPage;
			this.getAccidentList();
		},
		// 页面变化
		onSizeChange(current, newSize) {
			this.page.pageSize = newSize;
			this.getAccidentList();
		},
		// 获取设备列表
		async getAccidentList() {
			const {data: res} = await getAccidentList(this.page);
			console.log(res);
			if (res.code !== 20005) return this.$message.error("加载数据出错");
			this.page.list = res.data.list;
			this.page.totalCount = res.data.totalCount;
			this.flag = true;
			this.page.list.forEach(item => {
				console.log(item.status)
				if (item.status === 0)
					this.flag = false;
			})
		},
		async handleAccidentDelete(accId) {
			console.log(accId)
			const {
				data: res
			} = await deleleteById(accId);
			console.log(res);
			// 基于 ajax 删除
			let arr = this.page.list;
			arr.forEach((item, index, res) => {
				if (item.accId == accId) {
					res.splice(index, 1);
				}
			});
			this.page.list = arr;
		},
	},
};
</script>

<style scoped>
/deep/ .ant-modal-body {
	height: 480px !important;
	max-width: 100px;
	padding: 40px;
}


/deep/ .ant-modal-close-x {
	position: relative;
	right: 0px;
}


/deep/ .ant-row {
	width: 450px;

}

.search-group {
	/* margin-top: 30px; */
	/* left:-150px; */
	/* display: flex; */
	justify-content: space-around;
	position: relative;
}

.search-item {
	margin-right: 22px;
}
.search-item input {
	width: 150px;
}

.search-text {
	font-size: 15px;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: bold;
}

.search-btn {
	white-space: pre;
}

#export {
	float: right;
}

/* For demo */
.ant-carousel>>>.slick-slide {
	text-align: center;
	height: 400px;
	line-height: 400px;
	overflow: hidden;
	background-color: #FFFFFF;
}

.ant-carousel>>>.custom-slick-arrow {
	width: 25px;
	height: 25px;
	font-size: 25px;
	color: #1890FF;
	background-color: rgba(155, 45, 61, 0.11);
	opacity: 0.3;

}

.ant-carousel>>>.custom-slick-arrow:before {
	display: none;
}

.ant-carousel>>>.custom-slick-arrow:hover {
	opacity: 0.5;
}

.ant-carousel>>>.slick-slide h3 {
	color: #364d79;
}

.ant-carousel>>>.slick-thumb li img {
	width: 100%;
	height: 100%;
	filter: grayscale(100%);
}

/deep/ .ant-carousel .slick-dots li.slick-active button {
	background: #1890FF;
}

.ant-carousel>>>.slick-slide img {
	border: 5px solid #fff;
	display: block;
	margin: auto;
	max-width: 80%;
}

/deep/ .ant-modal {
	width: 500px !important;
}

/deep/.ant-modal-body {
	max-width: 2000px;
	padding: 20px;
}

/deep/ .slick-actice>button {
	background-color: #1890FF;
}
</style>
