import { loginAPI, getProfileAPI } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 作用域  变量作用的范围
// 原型链  属性查找范围
// 俩个链绝大多数情况下没有任何关系 平行不想交 哪怕名称看起来一样 不会影响
// with(obj) { console.log(a) }  Vue的模版解析语法有用到
// {{ name }} 组件实例身上的name属性  this.name
export default {
  namespaced: true,
  // 状态
  state: {
    token: getToken() || '', // 用户token
    userInfo: {}
  },
  // 修改状态的唯一方法(同步修改)
  mutations: {
    setToken(state, token) {
      state.token = token
      // 存入cookie
      setToken(token)
    },
    removeToken(state) {
      state.token = ''
      state.userInfo = {}
      removeToken()
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  // 异步函数
  actions: {
    async asyncLogin(ctx, { username, password }) {
      // 1. 调用异步请求 登录接口 -> token数据
      const res = await loginAPI({ username, password })
      // 2. 调用mutation把拿到的token数据存入state中
      ctx.commit('setToken', res.data.token)
    },

    async asyncGetUserInfo(ctx) {
      // 1. 获取用户权限数据 - 调用接口
      const res = await getProfileAPI()
      // 2. 调用mutation把用户数据存入state
      ctx.commit('setUserInfo', res.data)
      // 3. 找一个合适的地方出发action函数
      return res.data.permissions
    }
  }
}

// 组件通过了表单校验 -> 触发了action函数（表单数据）-> 调用了登录接口拿到了token数据 ->
// 提交了mutation(token) -> state中的token就有了真实的token数据

// 易错点：
// 1. action函数可能拼写错误 （模块名/action名字）
// 2. 传参（{username, password}） 一定要传一个对象并且里面必须按照接口文档字段来
