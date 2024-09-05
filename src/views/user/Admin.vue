<template>
	<div style="margin-top:-30px;margin-left: -25px;">
		<BreadList :list="['主页','系统管理','用户管理']" />
		<a-card>	
		<!-- 搜索框：-->
		<div>
			<div class="search-group">
				<a-button type="primary" style="float: left;margin-top: 0px!important;" @click="handleUserAdd()">
					新增
				</a-button>
				<div class="search-item" style="float: left;margin-top: 0px!important;">
					<span class="search-text">用户名:</span>
					<a-input v-model="page.params.userName" type="text" placeholder="可根据用户名称查询" />
				</div>
				<div class="search-item" style="float: left;margin-top: 0px!important;">
					<span class="search-text">身份:</span>
					<a-input v-model="page.params.identy" type="text" placeholder="可根据身份查询" />
				</div>

				<div class="search-item" style="float: left;margin-top: 0px!important;">
					<!-- 搜索按钮 -->
					<a-button type="primary" icon="search" style="float: left;margin-top: 0px!important;" @click="searchBySelect">
						查询
					</a-button>
				</div>
			</div>
			<a-divider style="margin-top:5px;"></a-divider>
		</div>
		<!-- 表单 -->
		<a-table rowKey="memberID" :pagination="false" :columns="columns" :data-source="page.list" :scroll="{ x: 300, y: 560 }">
			<template slot="password">
				<span>**********</span>
			</template>
			<template slot="identity" slot-scope="identity">
				<span v-if="identity==2">工作人员</span>
				<span v-if="identity==1">注册用户</span>
				<span v-if="identity==0">普通用户</span>
			</template>
			<template slot="operation" slot-scope="text, record">
				<a-space>
					<a-button type="primary" @click="handleUserEdit(record.memberID)">
						修 改
					</a-button>
					<a-popconfirm title="你确定要删除这条数据嘛？" ok-text="是的" cancel-text="不，点错了" @confirm="handleUserDelete(record.memberID)">
						<a-button type="danger"> 删 除</a-button>
					</a-popconfirm>
				</a-space>
			</template>
		</a-table>
		<br />
		<a-button type="primary"   style="float:left;margin-top: 15px;">总条数：{{page.totalCount}}</a-button><a-pagination v-model="page.currentPage" :page-size-options="['5', '10', '20', '50']" :total="page.totalCount"
		show-size-changer :page-size="page.pageSize" @showSizeChange="onSizeChange" @change="onPageChange">
		</a-pagination>

		<a-modal style="padding-bottom: 600px;" :footer="null" @cancel="cancel()" :visible="visible" :confirm-loading="confirmLoading">
			{{ editStatus === false ? "添加" : "修改" }}
			<!-- 新增维修信息的表单 -->
			<a-form-model style="height: 500px!important;" ref="ruleForm" :model="editUserInfo" :rules="rules" :label-col="labelCol"
			:wrapper-col="wrapperCol">
	<!-- 			<a-form-model-item ref="memberIDRef" label="用户ID" required>
					<a-input v-model="editUserInfo.memberID" :disabled="editStatus" />
				</a-form-model-item> -->

				<a-form-model-item ref="userNameRef" label="账号" required>
					<a-input v-model="editUserInfo.userName" />
				</a-form-model-item>
				<a-form-model-item ref="passwordRef" label="密码" required>
					<a-input v-model="editUserInfo.password" type="password"/>
				</a-form-model-item>
				<a-form-model-item ref="enterpriseIdRef" label="企业Id" required>
					<a-input v-model="editUserInfo.enterpriseId" />
				</a-form-model-item>
				<!-- 使用人员 -->
				<a-form-model-item ref="identityRef" label="身份" required>
					<a-input v-model="editUserInfo.identity" />
				</a-form-model-item>
				<a-form-model-item style="margin-left: 25%;" class="form-btn">
					<a-button @click="submit" type="primary"> Commit </a-button>
					<a-button style="margin-left: 20px" @click="cancel">
						Cancel
					</a-button>
				</a-form-model-item>
			</a-form-model>
		</a-modal>
</a-card>
	</div>
</template>

<script>

	import {
		getUserInfoByPage,
		addUser,
		updateUser,
		deleteUser,
		selectUserById
	} from "@/api/user.js"

	import {
		UserColumns as columns
	} from "@/assets/js/columns/StandBook.js";

	//防抖函数时间ID

	export default {
		name: "Admin",
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
						identity: "",
						userName: ""
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
				editUserInfo: {
					userName: "",
					password: "",
					enterpriseId:"",
					memberID: "",
					identity: ""
				},
				rules: {
					userNameRef: [{
						required: true,
						message: "请输入账号",
						trigger: "blur",
					}, ],
					passwordRef: [{
						required: true,
						message: "请输入密码",
						trigger: "blur",
					}, ],
					enterpriseIdRef: [{
						required: true,
						message: "请输入企业Id",
						trigger: "blur",
					}, ],
					identityRef: [{
						required: true,
						message: "请输入身份",
						trigger: "blur",
					}, ]
				},
				//列名的数组
				// loading: false,
				visible: false,
				columns
			};
		},
		created() {
			this.getUserList()
		},
		methods: {
			async initUserInfo(memberID) {
				console.log(memberID)
				const {
					data: res
				} = await selectUserById(memberID);
				console.log(res);
				if (res.code !== 20005) return this.$message.error("数据加载出错");
				this.editUserInfo = res.data;
			},
			submit() {
				this.$refs.ruleForm.validate(async (valid) => {
					console.log(this.editStatus);
					if (valid) {
						if (!this.editStatus) {
							const {
								data: res
							} = await addUser(this.editUserInfo);
							console.log(res)
							if (res.code !== 20004)
								return this.$message.success('添加出错')
							this.$message.success(res.msg)
						} else {
							const {
								data: res
							} = await updateUser(this.editUserInfo)
							console.log(res)
						}
						this.visible = false;
						this.getUserList();
						this.editUserInfo = {};
						this.resetForm();
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
				this.$refs.ruleForm.resetFields();
				this.visible = false;
				this.editUserInfo = {};
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
				this.$refs.ruleForm.resetFields();
				this.visible = false;
			},
			handleUserAdd() {
				this.editStatus = false;
				this.showModal();
			},
			async handleUserDelete(memberID) {
				const {
					data: res
				} = await deleteUser(memberID);
				this.loading = false;
				this.$message.success(res.msg);
				this.getUserList();
			},
			searchBySelect() {
				this.getUserList();
			},
			// 网络请求模拟数据
			async getUserList() {
				const {
					data: res
				} = await getUserInfoByPage(this.page);
				console.log(res);
				this.page.list = res.data.list;
				this.page.totalCount = res.data.totalCount;
				this.loading = false;
				this.$message.success(res.msg);
			},
			onPageChange(newPage) {
				this.page.currentPage = newPage;
				this.getUserList();
			},
			// 页面变化
			onSizeChange(current, newSize) {
				this.page.pageSize = newSize;
				this.getUserList();
			},
			onChange(memberID) {
				console.log(`a-switch to ${memberID}`);
				this.$message.success(memberID);
			},
			handleUserEdit(memberID) {
				this.showModal()
				this.editStatus = true
				this.initUserInfo(memberID)
			}
		}
	};
</script>

<style scoped >
	.search-group {
		/* margin-top: 30px; */
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
/deep/	.ant-modal-body{
		height: 520px!important;
	}
</style>
