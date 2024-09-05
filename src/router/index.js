import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from "./device/base.js"


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
	mode: "hash",
	routes
})

export default router
