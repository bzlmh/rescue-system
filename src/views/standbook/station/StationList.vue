<template>
	<div style="padding: 0;">
		<a-card>
			<!-- 搜索栏-->
			<div class="search-group" style="margin-top: 0!important;">
				<div class="search-item" style="float: left;">
					<span class="search-text">服务点名称：</span>
					<a-input v-model="page.params.staName" type="text" placeholder="可根据服务点名称查询" />
				</div>
				<div class="search-item">
					<a-button style="margin-top: 0!important;" type="primary" icon="search"
						@click="getStationList">查询</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
			<div>
				<a-button type="primary" icon="plus" @click="handleStaEdit(false)">新增</a-button>
			</div>
			<!-- 表格 -->
			<a-table rowKey="staId" :columns="columns" :pagination="false" :data-source="page.list" bordered
				:scroll="{ x: 1000 }">
				<template slot="operation" slot-scope="text, record">
					<a-space>
						<a-button type="primary" @click="handleStaEdit(true, record)">修改</a-button>
						<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了"
							@confirm="handleStaDelete(record.staId)">
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
					<a-form-model ref="staForm" :model="staInfo" :rules="rules">
						<a-form-model-item prop="staName" label="服务点名称" required>
							<a-input v-model="staInfo.staName" />
						</a-form-model-item>
						<a-form-model-item prop="staRange" label="服务范围" required>
							<a-input v-model="staInfo.staRange" />
						</a-form-model-item>
						<a-form-model-item prop="staTel" label="服务点热线" required>
							<a-input v-model="staInfo.staTel" />
						</a-form-model-item>
						<a-form-model-item prop="staLocation" label="服务点地址" required>
							<a-input v-model="staInfo.staLocation" />
						</a-form-model-item>
						<a-form-model-item prop="staResource" label="服务点资源" required>
							<a-input v-model="staInfo.staResource" />
						</a-form-model-item>
						<a-form-model-item prop="staAcompany" label="服务点合作组织" required>
							<a-input v-model="staInfo.staAcompany" />
						</a-form-model-item>
						<a-form-model-item prop="staDescribe" label="服务点描述" required>
							<a-input v-model="staInfo.staDescribe" />
						</a-form-model-item>
						<a-form-model-item prop="staMembers" label="服务点成员" required>
							<a-input v-model="staInfo.staMembers" />
						</a-form-model-item>
					</a-form-model>
				</a-modal>
			</div>
		</a-card>
	</div>
</template>

<script>
import {
	getStaList,
	addStaInfo,
	updateStaInfo,
	deleteStaById
} from "@/api/Station.js";

import { StationColumns as columns } from "@/assets/js/columns/StandBook.js";

// 服务站点信息
const staInfo = {
	staName: '',
	staRange: '',
	staTel: '',
	staLocation: '',
	staResource: '',
	staAcompany: '',
	staDescribe: '',
	staMembers: ''
}
// 新增/修改表单验证
const rules = {
	staName: [{ required: true, message: "请输入服务点名称", trigger: "change" }],
	staRange: [{ required: true, message: "请输入服务范围", trigger: "change" }],
	staTel: [{ required: true, message: "请输入服务点热线", trigger: "change" }],
	staLocation: [{ required: true, message: "请输入服务点地址", trigger: "change" }],
	staResource: [{ required: true, message: "请输入服务点资源", trigger: "change" }],
	staAcompany: [{ required: true, message: "请输入服务点合作组织", trigger: "change" }],
	staDescribe: [{ required: true, message: "请输入服务点描述", trigger: "change" }],
	staMembers: [{ required: true, message: "请输入服务点成员", trigger: "change" }]
};



export default {
	name: "StationList",
	data() {
		return {
			rules: { ...rules },
			modalVisible: false, // 新增/编辑表单是否显示
			staInfo: { ...staInfo },
			page: {
				currentPage: 1, // 当前页
				pageSize: 5, // 每页显示条数
				totalPage: 0, // 总页数
				totalCount: 0, // 总条数
				params: {}, // 查询参数对象
				list: [], // 列表数据
				sortColumn: "", // 排序列
				sortMethod: "", // 排序方式
			},

			editStationInfo: {
				staName: "",
				sta: "",
				orgEmail: "",
				orgAddress: "",
				orgMembers: "",
				orgRescue: 0,
			},
			//列名的数组
			columns,
			uploadDialogVisible: false,
			uploading: false,
			visible: false,
			pics: [],
			StationInfo: {},
			conuts: 0,
			flag: true,
			editStatus: false, // 编辑状态

		};
	},
	created() {
		this.getStationList();
	},
	methods: {
		// 新增/修改服务站点信息
		handleStaEdit(isEdit, record) {
			this.editStatus = isEdit;
			this.staInfo = isEdit ? { ...record } : { ...staInfo }
			this.modalVisible = true;
		},
		// 取消
		handleCancel() {
			this.$refs.staForm.clearValidate();
			this.modalVisible = false;
		},
		// 提交
		handleSubmit() {
			this.$refs.staForm.validate(async (valid) => {
				if (valid) {
					const { data: res } = this.editStatus ? await updateStaInfo(this.staInfo) : await addStaInfo(this.staInfo);
					if (res.code == 20000 || res.code == 20005) {
						this.getStationList();
						this.$message.success(res.data);
						this.modalVisible = false;
					} else {
						this.$message.error(res.msg || '操作失败');
					}
				}
			});
		},
		// 页数变化
		onPageChange(current) {
			this.page.currentPage = current;
			this.getStationList();
		},
		// 页数大小变化
		onSizeChange(current, size) {
			this.page.pageSize = size;
			this.getStationList();
		},
		// 获取服务站点列表
		async getStationList() {
			this.tableLoading = true;
			const { data: res } = await getStaList(this.page);
			if (res.code == 20005) {
				this.page.list = [...res.data.list];
				this.page.totalCount = res.data.totalCount;
			} else {
				this.$message.error(res.msg || '服务站点列表加载错误！');
			}
			this.tableLoading = false;
		},
		// 删除服务站点信息
		async handleStaDelete(staId) {
			const { data: res } = await deleteStaById(staId);
			if (res.code == 20000) {
				this.getStationList();
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
