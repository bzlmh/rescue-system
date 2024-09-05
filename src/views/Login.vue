<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像区域 -->
			<div class="avatar_box">
				<img src="../assets/header.png" alt="">
			</div>
			<div id="login-form">
				<a-form-model ref="ruleForm" class="login_form" :model="loginForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
					<a-form-model-item ref="username" label="账户" prop="username">
						<a-input v-model="loginForm.username" @blur="() => {$refs.username.onFieldBlur();}" placeholder="请输入工程部账号" />
					</a-form-model-item>
					<a-form-model-item ref="password" label="密码" prop="password">
						<a-input v-model="loginForm.password" type="password" @blur="() => {$refs.password.onFieldBlur();}" placeholder="请输入工程部密码" />
					</a-form-model-item>
					<a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
						<a-button type="primary" @click="onSubmit">
							登录
						</a-button>
						<a-button style="margin-left: 10px;" @click="resetForm">
							重置
						</a-button>
					</a-form-model-item>
				</a-form-model>
			</div>
		</div>
	</div>
</template>
<script>
	// import md5 from 'js-md5';
	// import {login} from '@/api/user.js'
	export default {
		name: 'Login',
		data() {
			return {
				labelCol: {
					span: 4
				},
				wrapperCol: {
					span: 14
				},
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
							required: true,
							message: '请输入账户',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 16,
							message: '账号的长度必须为 3 到 16',
							trigger: 'blur'
						},
					],
					password: [{
						required: true,
						message: '请务必输入密码',
						trigger: 'blur'
					},
					{
						min: 3,
						max: 32,
						message: '密码的长度必须为 3 到 32',
						trigger: 'blur'
					}]
				},
			};
		},
		methods: {
			// 提交表单
			onSubmit() {
				this.$router.push('/home')
				// this.$refs.ruleForm.validate(async valid => {
				// 	if (valid) {
				// 		// console.log(this.loginForm.username , md5(this.loginForm.password))
				// 		// let password = md5(this.loginForm.password)
				// 		// 执行登陆的逻辑
				// 		const {data : res} = await login({
				// 			userName: this.loginForm.username,
				// 			password: this.loginForm.password
				// 		})
				// 		console.log(res)
				// 		if (res.code !== 20007)
				// 			return this.$message.error('登录失败')
				// 		this.$router.push('/home')
				// 		// localStorage.setItem("token","this.loginForm.username")
				// 		return this.$message.success('登录成功')
				// 	} else {
				// 		console.log('error submit!!');
				// 		return false;
				// 	}
				// });
			},
			// 重置表单
			resetForm() {
				this.$refs.ruleForm.resetFields();
			},
		},
	};
</script>

<style scoped="scoped">
	.login_container {
		background-color: #2b4b6b;
		height: 100%;
	}

	/*     使用定位完成局中布局 */
	.login_box {
		width: 450px;
		height: 300px;
		background-color: rgba(255,255,255,0.9);
		border-radius: 3px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	
	#login-form {
		margin-left: 20px;
	}

	.avatar_box {
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
	}

	.avatar_box img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}

	.btns {
		display: flex;
		justify-content: flex-end;
	}

	.login_form {
		position: absolute;
		bottom: 0;
		padding: 0 20px;
		width: 100%;
		box-sizing: border-box;
	}
</style>
