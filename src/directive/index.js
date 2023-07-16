// 放置全局指令
import Vue from 'vue'
import store from '@/store'
Vue.directive('auth-btn', {
  // 指令的配置项
  inserted(el, binding) {
    // el: 指令绑定的dom元素
    // bingding.value: 指令绑定的数据
    console.log(el, binding.value)
    // 控制逻辑: 判断当前传入的按钮标识是否能在用户的权限点列表中找到 如果找不到 就隐藏按钮
    // 当前按钮自己的标识：binding.value
    // 当前用户的权限点数据列表：Vuex - user - userInfo - permissions
    const btnPerms = binding.value
    const permissions = store.state.user.userInfo.permissions
    if (!permissions.includes(btnPerms)) {
      el.remove()
    }
  }
})
