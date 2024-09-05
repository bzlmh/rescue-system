<template>
	<div class="home-container">
		<a-layout id="components-layout-demo-custom-trigger">
			<a-layout-sider v-model="collapsed" :trigger="null" collapsible>
				<div class="logo">
					<img src="../assets/logo.png" />
				</div>
				<a-menu theme="dark" :default-selected-keys="selected" :default-open-keys="openKeys" mode="inline"
					@click="handleClick">
					<a-menu-item :key="1">
						<a-icon type="home" />
						<span class="home-text">
							功能导航
						</span>
						<router-link to="/Home"></router-link>
					</a-menu-item>
					<!-- 一级菜单 -->
					<a-sub-menu :key="item.id" v-for="item of menus">
						<template slot="title">
							<a-icon :type="item.type" />
							<span v-if="item.children !== null">{{ item.authName }}</span>
							<span v-else @click="toHome()">{{ item.authName }}</span>
						</template>
						<!-- 二级菜单 -->
						<a-menu-item v-for="sub of item.children" :key="sub.id" @select="handleSelect(sub.id)">
							<router-link :to="item.path + '/' + sub.path">
								<a-icon :type="sub.type" />
								<span>{{ sub.authName }}</span>
							</router-link>
						</a-menu-item>
					</a-sub-menu>
				</a-menu>
			</a-layout-sider>
			<a-layout>
				<!-- 				<Upload></Upload> -->
				<!-- 头部标签 -->
				<a-layout-header style="background: #fff; padding: 0">
					<a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
						@click="() => (collapsed = !collapsed)" />
					<span class="title">
						高速救援管理系统
					</span>
					<!-- 登录用户基本信息显示 -->
					<span class="login_avatar">
						<a-dropdown placement="bottomCenter">
							<a-avatar size="large" @click="handleUser()" src="">
								<a-icon slot="icon" type="user" />
							</a-avatar>
							<a-menu slot="overlay">
								<a-menu-item>
									<a href="javascript:;">个人信息</a>
								</a-menu-item>
								<a-menu-item>
									<a href="javascript:;" @click="logout">退出</a>
								</a-menu-item>
							</a-menu>
						</a-dropdown>
					</span>
				</a-layout-header>
				<!-- 用于显示页面 -->
				<a-layout-content :style="{ margin: '24px 16px', padding: '24px', minHeight: '280px' }">
					<router-view></router-view>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>
<script>
// import {
// 	logout
// } from '../api/user.js'
// import Upload from '@/components/common/Upload.vue'
import menus from "@/mock/menu.js"
export default {
	name: 'Home',
	// components: {
	// 	Upload
	// },
	data() {
		return {
			collapsed: false,
			menus: [],
			selected: [1],
			openKeys: [1],
		};
	},
	mounted() {
		this.getMenuList()
		const keys = JSON.parse(sessionStorage.getItem('keys'))
		if (keys !== null && keys.length > 1) {
			this.openKeys[0] = keys[1]
			this.selected[0] = keys[0]
		}
	},
	beforeRouteLeave (){
		alert(this.$route.query.id)
		if(this.$route.query.id==="202"){
			alert(this.$route.query.id)
			this.$router.push('/standbook/order') 
		}
	},
	methods: {
		getMenuList() {
			this.menus = menus
		},
		handleClick(e) {
			sessionStorage.setItem('keys', JSON.stringify(e.keyPath))
		},
		// 处理退出登录
		logout() {
			// const {
			// 	data: res
			// } = await logout()
			// if (res.code !== 20000)
			// 	return this.$message.error(res.msg)
			window.localStorage.clear()
			window.sessionStorage.clear()
			this.$router.push('/login')
			this.$message.success('退出成功')
		}
	}
}
</script>

<style scoped="scoped">
.title {
	font-family: "微软雅黑";
	font-weight: bold;
	font-size: 16px;
}

.login_avatar {
	float: right;
	margin-right: 80px;
}

.home-container {
	height: 100%;
}

.logo img {
	width: 100%;
	/* height: 110px; */
}

#components-layout-demo-custom-trigger {
	height: 100%;
}

#components-layout-demo-custom-trigger .trigger {
	font-size: 18px;
	line-height: 64px;
	padding: 0 24px;
	cursor: pointer;
	transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
	color: #2B4B6B;
}

#components-layout-demo-custom-trigger .logo {
	/* height: 110px; */
	/* background: rgba(255, 255, 255, 0.2); */
	width: 90%;
	margin: 5%;
}
</style>
