<template>
	<div style="padding: 0;">
		<a-card>
			<!-- 搜索栏-->
			<div class="search-group" style="margin-top: 0!important;">
				<div class="search-item" style="float: left;">
					<span class="search-text">部门名称：</span>
					<a-input v-model="page.params.hostId" type="text" placeholder="可根据部门名称查询" />
				</div>
				<div class="search-item">
					<a-button style="margin-top: 0!important;" type="primary" icon="search"
						@click="getTelephoneList">查询</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
			<div>
				<a-button type="primary" icon="plus" @click="handleTelEdit(false)">新增</a-button>
			</div>
			<!-- 表格 -->
			<a-table rowKey="telId" :columns="columns" :pagination="false" :data-source="page.list" :scroll="{ x: 800 }"
				:loading="tableLoading" bordered>
				<template slot="telType" slot-scope="text">
					<span>{{ telTypeArr[text] }}</span>
				</template>
				<template slot="operation" slot-scope="text, record">
					<a-space>
						<a-button type="primary" @click="handleTelEdit(true, record)">修改</a-button>
						<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了"
							@confirm="handleTelDelete(record.telId)">
							<a-button type="danger"> 删 除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
			<br />
			<!-- 分页器 -->
			<a-pagination v-model="page.currentPage" :show-total="total => `总条数：${total}`"
				:page-size-options="['5', '10', '20', '50']" :total="page.totalCount" show-size-changer
				:page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
			</a-pagination>
			<!-- 新增/编辑表单 -->
			<div>
				<a-modal @cancel="handleCancel" :visible="modalVisible" @ok="handleSubmit">
					<h2 style="margin-bottom: 5px;font-size: 20px;">{{ editStatus ? '修改' : '新增' }}</h2>
					<a-form-model ref="telForm" :model="telInfo" :rules="rules">
						<a-form-model-item prop="telNumber" label="电话热线" required>
							<a-input v-model="telInfo.telNumber" />
						</a-form-model-item>
						<a-form-model-item prop="telType" label="所属部门类型" required>
							<a-select v-model="telInfo.telType">
								<a-select-option v-for="(item, index) in telTypeArr" :key="index" :value="index">
									{{ item }}
								</a-select-option>
							</a-select>
						</a-form-model-item>
						<a-form-model-item prop="hostId" label="所属部门" required>
							<a-input v-model="telInfo.hostId" />
						</a-form-model-item>
					</a-form-model>
				</a-modal>
			</div>
		</a-card>
	</div>
</template>

<script>
import { getTelephoneList, deleteTelById, addTelInfo, updateTelInfo } from "@/api/Telephone.js";
import { TelephoneColumns } from "@/assets/js/columns/StandBook.js";

// 电话信息
const telInfo = {
	hostId: '',
	telNumber: '',
	telType: 0,
}
// 新增/修改表单验证
const rules = {
	telNumber: [{ required: true, message: "请输入电话热线", trigger: "change" }],
	telType: [{ required: true, message: "请选择所属部门类型", trigger: "change" }],
	hostId: [{ required: true, message: "请输入所属部门", trigger: "change" }],
};

export default {
	name: "TelephoneList",
	data() {
		return {
			// 所属部门类型
			telTypeArr: ['监管部门', '组织部门', '服务站点'],
			tableLoading: false, // 列表是否加载中
			// 查询参数
			page: {
				currentPage: 1, // 当前页
				list: [], // 列表数据
				pageSize: 5, // 每页显示条数
				// 查询参数对象
				params: {},
				sortColumn: "", // 排序列
				sortMethod: "", // 排序方式
				totalCount: 0, // 总条数
				totalPage: 1, // 总页数
			},
			columns: [...TelephoneColumns], // 列表表头
			modalVisible: false, // 新增/编辑表单是否显示
			editStatus: false, // 编辑状态
			telInfo: { ...telInfo },
			rules: { ...rules }
		};
	},
	created() {
		this.getTelephoneList();
	},
	methods: {
		// 页数变化
		onPageChange(current) {
			this.page.currentPage = current;
			this.getTelephoneList();
		},
		// 页数大小变化
		onSizeChange(current, size) {
			this.page.pageSize = size;
			this.getTelephoneList();
		},
		// 获取电话信息列表
		async getTelephoneList() {
			this.tableLoading = true;
			const { data: res } = await getTelephoneList(this.page);
			if (res.code == 20005) {
				this.page.list = [...res.data.list];
				this.page.totalCount = res.data.totalCount;
			} else {
				this.$message.error(res.msg || '电话信息列表加载错误！');
			}
			this.tableLoading = false;
		},
		// 新增/修改电话信息
		handleTelEdit(isEdit, record) {
			this.editStatus = isEdit;
			this.telInfo = isEdit ? { ...record } : { ...telInfo }
			this.modalVisible = true;
		},
		// 提交
		handleSubmit() {
			this.$refs.telForm.validate(async (valid) => {
				if (valid) {
					const { data: res } = this.editStatus ? await updateTelInfo(this.telInfo) : await addTelInfo(this.telInfo);
					if (res.code == 20000) {
						this.getTelephoneList();
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
			this.$refs.telForm.clearValidate();
			this.modalVisible = false;
		},
		// 删除电话信息
		async handleTelDelete(telId) {
			const { data: res } = await deleteTelById(telId);
			if (res.code == 20000) {
				this.getTelephoneList();
				this.$message.success(res.data);
			} else {
				this.$message.error(res.msg || '操作失败');
			}
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