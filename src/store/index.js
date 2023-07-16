import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from './modules/user'
import menu from './modules/menu'
const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    user,
    menu
  }
})

export default store

// 如何在组件中使用store中的数据以及调用方法
// 1. 使用数据  this.$store.state.user.userInfo
// 2. 使用方法  this.$store.commit('user/setUserInfo', 参数)
// this.$store.dispatch('user/asyncLogin', 参数)
