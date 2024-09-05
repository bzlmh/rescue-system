import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.css'
import './plugins/ant-design-vue.js'
import '@/components/component.js' // 引入全局组件
import iView from 'iview'
// import 'iview/dist/styles/vivew.css'
Vue.config.productionTip = false
import BaiduMap  from 'vue-baidu-map'
import BaiduMarker  from 'vue-baidu-map'
import {BmlMarkerClusterer} from 'vue-baidu-map'
// import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
Vue.component('bml-marker-cluster', BmlMarkerClusterer)
Vue.component('baidu-marker', BaiduMarker)
Vue.use(iView)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak:'bpd3WQs16RWhIasyvzrhitV5npYvihvf'
  // ak :'0pusd90YGaepF3IBQrRqfArodwHP9sUh'
})