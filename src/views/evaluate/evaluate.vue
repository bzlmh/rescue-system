<template>
	<div style="padding: 0;">
		<BreadList :list="['用户评价与反馈','用户满意度']"/>
		<a-card>
			<div class="search-item" style="float: left;">
						<span class="search-text">订单号:</span>
						<a-input v-model="page.params.orderId" type="text" placeholder="可根据订单号查询" />
			</div>
			<div class="search-item" style="float: left;">
						<span class="search-text">按评价标准查询</span>
						<a-input v-model="page.params.standardName" type="text" placeholder="可根据评价标准查询：" />
			</div>
			<div class="search-item">
						<!-- 搜索按钮 -->
						<a-button style="margin-top: 0!important;" type="primary" icon="search" @click="searchBySelect">
							查询
						</a-button>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
			<!-- 表单 -->
			<a-table rowKey="evaluateId" :columns="columns" :pagination="false" :data-source="page.list" bordered
					:scroll="{ x: 1500, y: 560 }">
			</a-table>
			<br />
			<a-button type="primary" style="float:left;margin-top: 15px;">总条数：{{ page.totalCount }}</a-button>
			<a-pagination
				v-model="page.currentPage" :page-size-options="['4', '8', '16', '24']" :total="page.totalCount"
				show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
			</a-pagination>
		</a-card>
	</div>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import {
	getEvaluateList
} from "@/api/Evaluate.js"

import {
	EvaluateColumns as columns
} from "@/assets/js/columns/StandBook.js";

//防抖函数时间ID

export default {
	name: "EvualateList",
	data() {
		return {
			loading: true,
			confirmLoading: false,
			//数据库查到的数据
			page: {
				currentPage: 1, // 当前页
				pageSize: 4, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {
					orderId:"",
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
		this.getEvaluateList()
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		}
	},
	methods: {
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
			this.getEvaluateList();
		},
		// 网络请求模拟数据
		async getEvaluateList() {
			const {
				data: res
			} = await getEvaluateList(this.page);
			console.log(res);
			this.page.list = res.data.list;
			this.page.totalCount = res.data.totalCount;
			this.loading = false;
			this.$message.success(res.msg);
		},
		onPageChange(newPage) {
			this.page.currentPage = newPage;
			this.getEvaluateList();
		},
		// 页面变化
		onSizeChange(current, newSize) {
			this.page.pageSize = newSize;
			this.getEvaluateList();
		},
		onChange(evaluateId) {
			console.log(`a-switch to ${evaluateId}`);
			this.$message.success(evaluateId);
		// },
		// // 处理添加的
		// handleFixEdit(id) {
		// 	this.showModal()
		// 	this.editStatus = true
		// 	this.initMileInfo(id)
		// },
		// async creatQrcode(record) {
		// 	const {
		// 		data: res
		// 	} = await getUnlimited(record);
		// 	console.log(res)
		// 	this.$message.success(res.msg);
		// 	this.getMilestoneList();
		// }
	}
}
}
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
