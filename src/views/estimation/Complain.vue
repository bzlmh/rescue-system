<template>
	<div style="margin-top:-30px;margin-left: -25px;">
		<BreadList :list="['用户评价与反馈', '用户投诉管理']" />
		<div style="padding: 0;">
			<a-card>
				<!-- 搜索栏-->
				<div class="search-group" style="margin-top: 0!important;">
					<div class="search-item" style="float: left;">
						<span class="search-text">项目工单号：</span>
						<a-input v-model="page.params.orderId" type="text" placeholder="可根据项目工单号查询" />
					</div>
					<div class="search-item">
						<a-button style="margin-top: 0!important;" type="primary" icon="search" @click="getComplainList">查询</a-button>
					</div>
				</div>
				<a-divider style="margin-top:5px;"></a-divider>
				<a-button style="margin-top: 0!important;text-align: center;" type="primary" icon="plus"
					@click="handleComplainAdd">新增</a-button>
				<!-- 表格 -->
				<a-table rowKey="comId" :columns="columns" :pagination="false" :data-source="page.list" :loading="tableLoading"
					bordered :scroll="{ x: 1000 }">
					<template slot="comStatus" slot-scope="text,record">
						<a-switch :default-checked="!!text" :disabled="!!text" @change="updateComplainStatus(record)" />
					</template>
				</a-table>
				<br />
				<!-- 分页器 -->
				<a-pagination v-model="page.currentPage" :show-total="(total) => `总条数：${total}`"
					:page-size-options="['5', '10', '20', '50']" :total="page.totalCount" show-size-changer
					:page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange"> </a-pagination>
				<!-- 新增表单 -->
				<div>
					<a-modal @cancel="handleCancel" :visible="modalVisible" @ok="handleSubmit">
						<h2 style="margin-bottom: 5px;font-size: 20px;">新增</h2>
						<a-form-model ref="ComplainForm" :model="complainInfo" :rules="rules">
							<a-form-model-item prop="orderId" label="项目工单号" required>
								<a-input v-model="complainInfo.orderId" />
							</a-form-model-item>
							<a-form-model-item prop="standardId" label="投诉类别" required>
								<a-select v-model="complainInfo.standardId">
									<a-select-option v-for="(item) in standardObj" :key="item.id" :value="item.id">
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-model-item>
							<a-form-model-item prop="comDescribe" label="投诉内容" required>
								<a-input v-model="complainInfo.comDescribe" />
							</a-form-model-item>
						</a-form-model>
					</a-modal>
				</div>
			</a-card>
		</div>
	</div>
</template>

<script>
import {
	getComplainList,
	updateComplainStatus,
	addComplainInfo,
} from "@/api/Complain.js";
import { ComplainColumns } from "@/assets/js/columns/StandBook.js";

// 投诉信息
const complainInfo = {
	comDescribe: '',
	comId: 0,
	comStatus: 0,
	orderId: '',
	standardId: 1
};
// 新增表单验证
const rules = {
	comDescribe: [{ required: true, message: "请输入投诉内容", trigger: "change", },],
	standardId: [{ required: true, message: "请选择投诉类别", trigger: "change", },],
	orderId: [{ required: true, message: "请输入项目工单号", trigger: "change", },],
};

export default {
	name: "ComplainList",
	data() {
		return {
			tableLoading: false, // 列表是否加载中
			page: {
				currentPage: 1, // 当前页
				pageSize: 5, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {}, // 查询参数对象
				list: [], // 列表数据
				sortColumn: '', // 排序列
				sortMethod: '', // 排序方式
			},
			complainInfo: { ...complainInfo },
			rules: { ...rules },
			columns: [...ComplainColumns], // 列表表头
			modalVisible: false, // 新增/编辑表单是否显示
			// 投诉类别
			standardObj: [
				{ id: 1, name: '救援速度' },
				{ id: 2, name: '服务态度' },
				{ id: 3, name: '收费合理性' },
				{ id: 4, name: '救援专业性' },
			]
		};
	},
	created() {
		this.getComplainList();
	},
	methods: {
		// 新增组织信息
		handleComplainAdd() {
			this.complainInfo = { ...complainInfo }
			this.modalVisible = true;
		},
		// 修改投诉状态
		async updateComplainStatus(record) {
			const { data } = await updateComplainStatus(record.comId);
			if (data.code == 20000) {
				this.getComplainList();
				this.$message.success('用户投诉已处理');
			} else {
				this.$message.error(data.msg)
			}
		},
		// 提交
		async handleSubmit() {
			this.$refs.ComplainForm.validate(async (valid) => {
				if (valid) {
					const { data: res } = await addComplainInfo(this.complainInfo);
					if (res.code == 20005 || res.code == 20000) {
						this.getComplainList();
						this.$message.success(res.data);
						this.modalVisible = false;
					} else {
						this.$message.error(res.msg || '操作失败');
					}
				}
			});
		},
		// 取消
		handleCancel() {
			this.$refs.ComplainForm.clearValidate();
			this.modalVisible = false;
		},
		// 页数变化
		onPageChange(current) {
			this.page.currentPage = current;
			this.getComplainList();
		},
		// 页数大小变化
		onSizeChange(current, size) {
			this.page.pageSize = size;
			this.getComplainList();
		},
		// 获取组织列表
		async getComplainList() {
			this.tableLoading = true;
			const { data: res } = await getComplainList(this.page);
			if (res.code == 20005) {
				this.page.list = [...res.data.list];
				this.page.totalCount = res.data.totalCount;
			} else {
				this.$message.error(res.msg || '组织列表加载错误！');
			}
			this.tableLoading = false;
		},
	},
};
</script>

<style scoped>
.search-group {
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

.ant-carousel>>>.slick-slide img {
	border: 5px solid #fff;
	display: block;
	margin: auto;
	max-width: 80%;
}
</style>
