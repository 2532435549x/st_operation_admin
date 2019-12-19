/*
 * @Description: main.js
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-21 11:35:18
 * @LastEditors: wangyun
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang zh-CN
Vue.use(ElementUI, {
  locale
})

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import App from './App'
import router from './router'
import store from './store'
import '@/styles/index.scss' // global css

import '@/icons' // icon
import '@/permission' // permission control


import mixin from '@/utils/mixins/mixin'
Vue.mixin(mixin)

import { checkSort } from '@/utils/validate'
Vue.prototype.$checkSort = checkSort

Vue.prototype.fullHeight = window.screen.height * 0.67 // 获取屏幕高度

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
