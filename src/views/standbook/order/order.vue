<template>
		<!-- 列表展示页 -->
	<div style="padding: 0;">
		<BreadList :list="['救援工单管理','工单管理']"/>
		<a-card>
			<!-- 搜索框：根据设备名称查询-->
			<div class="search-group" style="margin-top: 0!important;">
				<div class="increased" style="float: left ;">
				</div>
				<div class="search-item" style="float: left;">
					<span class="search-text">工单号:</span>
					<a-input v-model="page.params.orderId" type="text" placeholder="可根据工单号查询" />
				</div>
				<div class="search-item">
					<!-- 搜索按钮 -->
					<a-button style="margin-top: 0!important;" type="primary" icon="search" @click="searchBySelect">
						查询
					</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
			<!-- 表格 table -->
			<a-table rowKey="orderId" :columns="columns" :pagination="false" :data-source="page.list" bordered
				:scroll="{ x: 800, y: 560 }">
				<template slot="status" slot-scope="status">
					<span v-if="status === 0">已分配救援服务点</span>
					<span v-if="status === 1">救援组织到达</span>
					<span v-if="status === 2">完成救援任务</span>
			</template>
			<template slot="createTime" slot-scope="text, record">
						{{ record.createTime | formatDate }}
			</template>
			<template slot="endTime" slot-scope="text, record">
						{{ record.endTime | formatDate }}
			</template>
				<template slot="operation" slot-scope="text, record" >
					<a-dropdown :placement="placement" 	:disabled="record.status === 2" >
						<a-button>修改状态</a-button>
						<a-menu slot="overlay">
						<a-menu-item @click="MenuSelect(record, '0')">
							<a target="_blank">已分配救援服务点</a>
						</a-menu-item>
						<a-menu-item  @click="MenuSelect(record, '1')">
							<a target="_blank">救援组织到达</a>
						</a-menu-item>
						<a-menu-item  @click="MenuSelect(record, '2')">
							<a target="_blank">完成救援任务</a>
						</a-menu-item>
						</a-menu>
					</a-dropdown>
				</template>
			</a-table>
			<br />
			<!-- 表格 table 结束 -->
			<a-button type="primary" style="float:left;margin-top: 15px;">总条数：{{ page.totalCount }}</a-button><a-pagination
				v-model="page.currentPage" :page-size-options="['5', '10', '20', '50']" :total="page.totalCount"
				show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
			</a-pagination>
			<!-- 编辑的对话框 -->
		</a-card>
	</div>
</template>

<script>
const formItemLayout = {
	labelCol: {
		span: 4
	},
	wrapperCol: {
		span: 3
	},
};
import { format } from "date-fns";
// column 列封装
import {
	getOrderList,updateStatus,
} from "@/api/Order.js";

import {
	OrderColumns as columns
} from "@/assets/js/columns/StandBook.js";

// import XLSX from "xlsx";
export default {
	name: "OrderList",
	data() {
		return {
			formItemLayout,
			loading: true,
			// 搜索栏目
			confirmLoading: false,
			page: {
				currentPage: 1, // 当前页
				pageSize: 5, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {
					mileagePile: "",
					name: "",
					mobile: ""
				}, // 查询参数对象
				list: [], // 数据
				sortColumn: "", // 排序列
				sortMethod: "", // 排序方式
			},
			editOrganizationInfo: {
				orgName: "",
				orgTel: "",
				orgEmail: "",
				orgAddress: "",
				orgMembers: "",
				orgRescue: 0,
			},
			rules: {
				orgNameRef: [{
					required: true,
					message: "修改组织名称",
					trigger: "blur",
				},],
				orgTelRef: [{
					required: true,
					message: "修改电话",
					trigger: "blur",
				},],
				orgEmailRef: [{
					required: true,
					message: "修改邮箱",
					trigger: "blur",
				},],
				orgAddressRef: [{
					required: true,
					message: "修改组织所在地",
					trigger: "blur",
				},],
				orgMembersRef: [{
					required: true,
					message: "修改组织成员",
					trigger: "blur",
				},],
			},
			//列名的数组
			columns: [],
			uploadDialogVisible: false,
			uploading: false,
			visible: false,
			pics: [],
			OrganizationInfo: {},
			conuts: 0,
			flag: true,
			editStatus: false,
			selectedStatus:null, // 用于存储选中的状态
			selectedOrderId:null,// 用于存储选中的 orderId
			// uploadUrl: "http://121.196.166.190/api/v1/private/oss/upload?OrganizationId=",
		};
	},
	created() {
		this.columns = columns;
		this.getOrderList();
		this.$message.success("查询成功");
	},
	mounted() {
		const mileId = this.$route.query.mileId;
		if (mileId != null) {
			this.page.params.mileagePile = mileId;
		}
		this.getOrderList();
	},
	filters: {
		formatDate(timestamp) {
			if (timestamp === 0) {
			return null; // 返回一个默认值，或者你想要的任何提示
			} else {
			const date = new Date(timestamp);
			return format(date, "yyyy-MM-dd HH:mm:ss");
			}
  },
},
	methods: {
		//Add
		handleOrganizationAdd() {
			this.editOrganizationInfo = {};
			this.editStatus = false;
			this.showModal();
		},

		// 处理添加的
		handleOrganizationEdit(info) {
			this.editOrganizationInfo = info
			this.showModal()
			this.editStatus = true
		},
		showModal() {
			this.visible = true;
		},
		cancel() {
			this.visible = false
			this.getOrderList()
		},
		//按照条件查询
		searchBySelect() {
			this.getOrderList();
		},
		//第几页
		onPageChange(newPage) {
			this.page.currentPage = newPage;
			this.getOrderList();
		},
		// 页面5，10，20变化，修改分页的参数
		onSizeChange(current, newSize) {
			this.page.pageSize = newSize;
			this.getOrderList();
		},
		async MenuSelect(record,key){
			this.selectedStatus =parseInt(key);
			this.selectedOrderId= record.orderId;
			console.log(this.selectedOrderId)
			console.log(this.selectedStatus)
			const res = await updateStatus(this.selectedOrderId,this.selectedStatus);
			if (res.data.code !== 20000) {
            console.log('修改失败');
            this.$message.error('修改失败');
			}else{
			console.log('修改成功');
            this.$message.success('修改成功');
			}
			this.getOrderList();
			this.$message.success("查询成功");
    },
		// 获取设备列表，分页查询
		async getOrderList() {
			const { data: res } = await getOrderList(this.page);
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
			if (this.flag === false) {
				this.handlePlay();
			} else {
				this.handlePause();
			}
			this.loading = false;
			this.page.params.mileagePile = ""
		},
	},
};
</script>

<style scoped>
/deep/ .ant-modal-body {
	height: 700px !important;
	max-width: 600px;
	padding: 40px;
}

.ant-input {
	width: 60%;
}

/deep/ .ant-modal-close-x {
	position: relative;
	right: 0px;
}


/deep/ .ant-row {
	width: 855px;
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
	width: 605px !important;
}

/deep/ .slick-actice>button {
	background-color: #1890FF;
}
</style>