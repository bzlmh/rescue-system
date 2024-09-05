import Home from '@/views/Home.vue'
import childrens from './children.js'

const routes = [{
		path: '/',
		redirect: '/login',
	},
	{
		path: "/login",
		name: 'Login',
		component: () => import('@/views/Login.vue')
	},
	{
		path: "/home",
		component: Home,
		name: 'Home',
		redirect: '/welcome',
		children: childrens
	},
	{
		path: "/toHome",
		component: Home,
		name: 'Home',
	},
	{
		path: "/3D",
		component:() => import('@/views/utils/3Dtest.vue'),
		name: 'Home',
	},
]

export default routes
