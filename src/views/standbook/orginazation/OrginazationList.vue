<template>
	<div style="padding: 0;">
		<a-card>
			<!-- 搜索栏-->
			<div class="search-group" style="margin-top: 0!important;">
				<div class="search-item" style="float: left;">
					<span class="search-text">组织名称：</span>
					<a-input v-model="page.params.orgName" type="text" placeholder="可根据组织名称查询" />
				</div>
				<div class="search-item" style="float: left;">
					<span class="search-text">电话号码：</span>
					<a-input v-model="page.params.orgTel" placeholder="请输入电话查询" />
				</div>
				<div class="search-item">
					<a-button style="margin-top: 0!important;" type="primary" icon="search"
						@click="getOrganizationList">查询</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
			<a-button style="margin-top: 0!important;text-align: center;" type="primary" icon="plus"
				@click="handleOrganizationEdit(false)">新增</a-button>
			<!-- 表格 -->
			<a-table rowKey="orgId" :columns="columns" :pagination="false" :data-source="page.list" :loading="tableLoading"
				bordered :scroll="{ x: 1000 }">
				<template slot="operation" slot-scope="text, record">
					<a-space>

						<a-button type="primary" @click="handleOrganizationEdit(true, record)">

							修 改
						</a-button>
						<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了"
							@confirm="handleOrganizationDelete(record.orgId)">
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
					<h2 style="margin-bottom: 5px;font-size: 20px;">{{ editStatus ? "修改" : "新增" }}</h2>
					<a-form-model ref="organizationForm" :model="organizationInfo" :rules="rules">
						<a-form-model-item prop="orgName" label="组织名称" required>
							<a-input v-model="organizationInfo.orgName" />
						</a-form-model-item>
						<a-form-model-item prop="orgTel" label="电话号码" required>
							<a-input v-model="organizationInfo.orgTel" />
						</a-form-model-item>
						<a-form-model-item prop="orgEmail" label="组织邮箱" required>
							<a-input v-model="organizationInfo.orgEmail" />
						</a-form-model-item>
						<a-form-model-item prop="orgAddress" label="组织所在地" required>
							<a-input v-model="organizationInfo.orgAddress" />
						</a-form-model-item>
						<a-form-model-item prop="orgMembers" label="组织成员" required>
							<a-input v-model="organizationInfo.orgMembers" />
						</a-form-model-item>
					</a-form-model>
				</a-modal>
			</div>
		</a-card>
	</div>
</template>

<script>
import {
	getOrganizationList,
	deleteById,
	updateOrganizationInfo,
	addOrganizationInfo,
} from "@/api/Organization.js";
import { OrganizationColumns } from "@/assets/js/columns/StandBook.js";

// 组织信息
const organizationInfo = {
	orgName: "",
	orgTel: "",
	orgEmail: "",
	orgAddress: "",
	orgMembers: "",
	orgRescue: 0,
};
// 新增/修改表单验证
const rules = {
	orgName: [{ required: true, message: "请输入组织名称", trigger: "change", },],
	orgTel: [{ required: true, message: "请输入电话号码", trigger: "change", },],
	orgEmail: [{ required: true, message: "请输入组织邮箱", trigger: "change", },],
	orgAddress: [{ required: true, message: "请输入组织所在地", trigger: "change", },],
	orgMembers: [{ required: true, message: "请输入组织成员", trigger: "change", },],
};

export default {
	name: "OrganizationList",
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
			organizationInfo: { ...organizationInfo },
			rules: { ...rules },
			columns: [...OrganizationColumns], // 列表表头
			modalVisible: false, // 新增/编辑表单是否显示
			editStatus: false, // 编辑状态
		};
	},
	created() {
		this.getOrganizationList();
	},
	methods: {
		// 新增/修改组织信息
		handleOrganizationEdit(isEdit, record) {
			this.editStatus = isEdit;
			this.organizationInfo = isEdit ? { ...record } : { ...organizationInfo }
			this.modalVisible = true;
		},
		// 提交
		async handleSubmit() {
			this.$refs.organizationForm.validate(async (valid) => {
				if (valid) {
					const { data: res } = this.editStatus ? await updateOrganizationInfo(this.organizationInfo) : await addOrganizationInfo(this.organizationInfo);
					if (res.code == 20005 || res.code == 20000) {
						this.getOrganizationList();
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
			this.$refs.organizationForm.clearValidate();
			this.modalVisible = false;
		},
		// 页数变化
		onPageChange(current) {
			this.page.currentPage = current;
			this.getOrganizationList();
		},
		// 页数大小变化
		onSizeChange(current, size) {
			this.page.pageSize = size;
			this.getOrganizationList();
		},
		// 获取组织列表
		async getOrganizationList() {
			this.tableLoading = true;
			const { data: res } = await getOrganizationList(this.page);
			if (res.code == 20005) {
				this.page.list = [...res.data.list];
				this.page.totalCount = res.data.totalCount;
			} else {
				this.$message.error(res.msg || '组织列表加载错误！');
			}
			this.tableLoading = false;
		},
		// 删除组织
		async handleOrganizationDelete(orgId) {
			const { data: res } = await deleteById(orgId);
			if (res.code == 20000) {
				this.getOrganizationList();
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
