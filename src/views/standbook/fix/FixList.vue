<template>
	<a-card>
		<div>
			<!-- 			<a-button type="primary" @click="handleFixAdd">新增</a-button>
			<a-button type="primary" @click="handleExport">导出</a-button>
			<a-button id="fixDetail" type="primary" @click="handleFixDetail">查看维修详情</a-button> <br /><br /> -->

			<!-- 搜索框：-->
			<div class="search-group">

				<a-button type="primary" style="float: left;margin-top: 0px!important;" @click="handleMileAdd()">
					新增
				</a-button>
				<a-button type="primary" style="float: left;margin-top: 0px!important;" icon="download" @click="downPic()">
					导出二维码
				</a-button>
				<div class="search-item" style="float: left;margin-top: 0px!important;">
					<span class="search-text">桩号:</span>
					<a-input v-model="page.params.mileId" type="text" placeholder="可根据桩号查询" />
				</div>
				<!-- 	<div class="search-item">
					<span class="search-text">路线方向:</span>
					<a-input v-model="page.params.lineDirection" placeholder="请输入设备编号查询" />
				</div> -->
				<div class="search-item" style="float: left;margin-top: 0px!important;">
					<!-- 搜索按钮 -->
					<a-button type="primary" icon="search" @click="searchBySelect" style="margin-top: 0px!important;">
						查询
					</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
		</div>
		<!-- 表单 -->
		<a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" rowKey="id"
			:pagination="false" :columns="columns" :data-source="page.list" :scroll="{ x: 300, y: 560 }">

			<template slot="lineDirection" slot-scope="lineDirection">
				<span v-if="lineDirection === 1">上行往湖北方向 </span>
				<span v-if="lineDirection === 2">下行往河南方向 </span>
			</template>
			<template slot="qrcode" slot-scope="qrcode">
				<img :src="qrcode" />
			</template>
			<template slot="operation" slot-scope="text, record">
				<a-space>
					<a-button type="primary" @click="handleFixEdit(record.id)">
						修 改
					</a-button>
					<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了"
						@confirm="handleMilestoneDelete(record.id)">
						<a-button type="danger"> 删 除</a-button>
					</a-popconfirm>
					<a-button type="primary" @click="creatQrcode(record)">
						生成二维码
					</a-button>
				</a-space>
			</template>
		</a-table>
		<br />
		<a-button type="primary" style="float:left;margin-top: 15px;">总条数：{{ page.totalCount }}</a-button><a-pagination
			v-model="page.currentPage" :page-size-options="['5', '10', '20', '50']" :total="page.totalCount"
			show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
		</a-pagination>

		<!-- 编辑的对话框 -->
		<div>
			<a-modal :footer="null" @cancel="cancel()" :visible="visible" :confirm-loading="confirmLoading">
				{{ editStatus === false ? "添加" : "修改" }}
				<!-- 新增维修信息的表单 -->
				<a-form-model style="height: 300px;" ref="ruleForm" :model="editMilestoneInfo" :rules="rules"
					:label-col="labelCol" :wrapper-col="wrapperCol">
					<!-- 设备名称 -->
					<a-form-model-item ref="mileIdRef" label="桩号" required>
						<a-input v-model="editMilestoneInfo.mileId" :disabled="editStatus" />
					</a-form-model-item>
					<!--          路线方向(1为上行,2为下行-->
					<a-form-model-item ref="lineDirectionRef" label="路线方向(1为上行,2为下行)" required>
						<a-input v-model="editMilestoneInfo.lineDirection" />
					</a-form-model-item>
					<!-- 经纬度 -->
					<a-form-model-item ref="coordinatesRef" label="经纬度" required>
						<a-input v-model="editMilestoneInfo.coordinates" />
					</a-form-model-item>
					<!-- 级别 -->
					<a-form-model-item ref="coordinatesRef" label="级别" required>
						<!--            <a-input v-model="editMilestoneInfo.coordinates" />-->
						<a-input value="正常" />
					</a-form-model-item>
					<!-- 判定距离 -->
					<a-form-model-item ref="coordinatesRef" label="判定距离" required>
						<a-input value="50" />
						<!--            <a-input v-model="editMilestoneInfo.coordinates" />-->
					</a-form-model-item>
					<a-form-model-item style="margin-left: 25%;" class="form-btn">
						<a-button @click="submit" type="primary"> Commit </a-button>
						<a-button style="margin-left: 20px" @click="cancel">
							Cancel
						</a-button>
					</a-form-model-item>
				</a-form-model>
			</a-modal>
		</div>
	</a-card>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import {
	getMileById,
	addMilestone,
	updateMilestone
} from "@/api/Fix.js"

import {
	getMilestoneList,
	getUnlimited,
	// downPic,
	deleteMilestonrByMileId
} from "@/api/Fix.js";
import {
	MilestoneColumns as columns
} from "@/assets/js/columns/StandBook.js";

//防抖函数时间ID

export default {
	name: "FixList",
	data() {
		return {
			loading: true,
			confirmLoading: false,
			//数据库查到的数据
			page: {
				currentPage: 1, // 当前页
				pageSize: 5, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {
					mileId: "",
					lineDirection: ""
				}, // 查询参数对象
				list: [], // 数据
				sortColumn: "", // 排序列
				sortMethod: "", // 排序方式
			},
			//添加新信息
			labelCol: {
				span: 0,
			},
			wrapperCol: {
				span: 24,
			},
			other: "",
			editStatus: false, // 默认添加
			editMilestoneInfo: {
				id: "",
				coordinates: "",
				lineDirection: 1,
				mileId: ""
			},
			rules: {
				mileIdRef: [{
					required: true,
					message: "请输入桩号",
					trigger: "blur",
				},],
				coordinatesnRef: [{
					required: true,
					message: "请输入经纬度",
					trigger: "blur",
				},],
				lineDirectionRef: [{
					required: true,
					message: "请输入路线方向",
					trigger: "blur",
				},]
			},
			//列名的数组
			// loading: false,
			visible: false,
			columns,
			selectedRowKeys: [], // Check here to configure the default column
			datas: []
		};
	},
	created() {
		// this.initFixDetailInfo();
		this.getMilestoneList()
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		}
	},
	methods: {
		async initMileInfo(id) {
			console.log(id);
			const {
				data: res
			} = await getMileById(id);
			console.log(res);
			if (res.code !== 20005) return this.$message.error("数据加载出错");
			this.editMilestoneInfo = res.data;
		},
		submit() {
			this.$refs.ruleForm.validate(async (valid) => {
				if (valid) {
					if (!this.editStatus) {
						const {
							data: res
						} = await addMilestone(this.editMilestoneInfo);
						if (res.code !== 20006)
							return this.$message.success('添加出错')
						this.$message.success(res.msg)
					} else {
						const {
							data: res
						} = await updateMilestone(this.editMilestoneInfo)
						console.log(res)
					}
					this.visible = false;
					this.getMilestoneList();
				} else {
					console.log("error submit!!");
					this.$message.success("error submit!!");
					return false;
				}

			});

		},
		resetForm() {
			this.$refs.ruleForm.resetFields();
		},
		cancel() {
			// console.log(e)
			// this.resetForm();
			this.visible = false;
		},
		showModal() {
			this.visible = true;
		},
		handleOk() {
			this.loading = true;
			setTimeout(() => {
				this.visible = false;
				this.loading = false;
			}, 3000);
		},
		handleCancel() {
			this.visible = false;
		},
		getFile(url) {
			return new Promise((resolve, reject) => {
				axios({
					method: 'get',
					url: url,
					responseType: 'arraybuffer'
				}).then(data => {
					resolve(data.data)
				}).catch(error => {
					reject(error.toString())
				})
			})
		},
		// 批量下载
		async handleBatchDownload() {
			this.datas = [];
			this.datas = this.selectedRowKeys;
			for (let i = 0; i < this.datas.length; i++) {
				let name = this.datas[i];
				// data[i] = "http://394uo54364.qicp.vip/img/" + name + ".jpg";
				this.datas[i] = "https://odeli.top:8099/img/" + name + ".jpg";
			}
			const zip = new JSZip()
			const cache = {}
			const promises = []
			await this.datas.forEach(item => {
				const promise = this.getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
					const arr_name = item.split("/");
					let file_name = arr_name[arr_name.length - 1] // 获取文件名
					// if (file_name.indexOf('.png') == -1) {
					//    file_name = file_name + '.png'
					// }
					zip.file(file_name, data, {
						binary: true
					}) // 逐个添加文件
					cache[file_name] = data
				})
				promises.push(promise)
			})
			Promise.all(promises).then(() => {
				zip.generateAsync({
					type: "blob"
				}).then(content => { // 生成二进制流
					FileSaver.saveAs(content, "photo.zip") // 利用file-saver保存文件
				})
			})
			this.datas = [];
			this.selectedRowKeys = [];
		},
		handleMileAdd() {
			this.editMilestoneInfo = {};
			this.editStatus = false;
			this.showModal();
		},
		async handleMilestoneDelete(id) {
			const {
				data: res
			} = await deleteMilestonrByMileId(id);
			this.loading = false;
			this.$message.success(res.msg);
			this.getMilestoneList();
		},
		async downPic() {
			this.handleBatchDownload();
		},
		start() {
			this.loading = true;
			// ajax request after empty completing
			setTimeout(() => {
				this.loading = false;
				this.selectedRowKeys = [];
			}, 10);
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		searchBySelect() {
			this.getMilestoneList();
		},
		// 网络请求模拟数据
		async getMilestoneList() {
			const {
				data: res
			} = await getMilestoneList(this.page);
			console.log(res);
			this.page.list = res.data.list;
			this.page.totalCount = res.data.totalCount;
			this.loading = false;
			this.$message.success(res.msg);
		},
		onPageChange(newPage) {
			this.page.currentPage = newPage;
			this.getMilestoneList();
		},
		// 页面变化
		onSizeChange(current, newSize) {
			this.page.pageSize = newSize;
			this.getMilestoneList();
		},
		onChange(FixId) {
			console.log(`a-switch to ${FixId}`);
			this.$message.success(FixId);
		},
		// 处理添加的
		handleFixEdit(id) {
			this.showModal()
			this.editStatus = true
			this.initMileInfo(id)
		},
		async creatQrcode(record) {
			const {
				data: res
			} = await getUnlimited(record);
			console.log(res)
			this.$message.success(res.msg);
			this.getMilestoneList();
		}
	}
};
</script>

<style scoped>
.search-group {
	/* margin-top: 0px; */
	float: left;
	/* display: flex; */
	justify-content: space-around;
}

.search-item {
	margin-right: 22px;
}

.search-item input {
	width: 120px;
}

.search-text {
	font-size: 18px;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: bold;
}

.search-btn {
	white-space: pre;
}

#fixDetail {
	float: right;
}

img {
	width: 80px;
	height: 100px;
}

/deep/ .ant-modal-body {
	height: 620px !important;
}</style>
