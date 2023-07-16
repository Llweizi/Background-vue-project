
import Vue from 'vue'
// 初始化样式
import 'normalize.css/normalize.css'
// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

// 引入根组件
import App from './App'
// 引入Vuex
import store from './store'
// 引入Router路由
import router from './router'

// 注册svg全局组件 可以在任何一个组件中使用svg图标

import '@/icons'
import WujieVue from 'wujie-vue2'

Vue.use(WujieVue)

// 把所有的组件注册为全局组件
Vue.use(ElementUI)
Vue.config.productionTip = false

// vue实例化
// 在实例化过程中把路由和vuex在项目中进行注入之后完成根组件的渲染最后挂在到id为app的元素上

// 职责：项目主要的初始化工作（全局生效的事情）

// 测试login的使用方式
// import { login } from '@/api/user'
// login({ username: 'admin', password: 'admin123' }).then(res => console.log(res))
// 让权限文件生效（直接把permission里面的所有能执行的代码都执行一下）
import './permission'
import './directive'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
