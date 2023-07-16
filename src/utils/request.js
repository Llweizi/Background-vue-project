import axios from 'axios'
import { getToken } from './auth'
import { Message } from 'element-ui'

// 实例化
// 1. 配置项目接口基地址 - baseURL
// 2. 接口超时时间 - timeout 100ms

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1/',
  timeout: 5000 // request timeout
})

// 请求拦截器
// 1. 配置请求头 - token 做接口鉴权的 后端会自动获取做判断 是否正常返回数据
service.interceptors.request.use(
  config => {
    // 易错点：在config身上可以做很多配置 最后一定要return 后果丢失请求参数
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
// 1. 401状态码判断 判断token是否失效 如果是 就是401 跳转到登录重新获取新的token
// 2. resoponse.data 可以在组件业务中获取接口数据的时候少写一个.data
service.interceptors.response.use(
  // HTTP状态码作为是否成功的标志 200-300 2xx 标记为成功 不在这个范围内 标记为错误
  // 成功回调
  // 因为状态码后端是可以自由控制的，哪怕现在接口已经错误，但是依旧可以返回200
  // axios会以为当前成功了，走第一个成功回调，拿不到错误对象
  // 解决办法：前端自己去做接口成功或者失败的判断 返回一个定义的是否成功的字段
  // { data: {success: false, data:[]}}
  response => {
    return response.data
  },
  // 失败回调
  error => {
    // Token 401处理
    console.dir(error.response.status)
    if (error.response.status === 401) {
      // 1. 跳转到登录
      router.push('/login')
      // 2. 清空用户数据
      store.commit('user/clearUserInfo')
    }
    return Promise.reject(error)
  }
)

// 什么是拦截？
// 请求拦截就是在正式发送请求之前我先不让你过去，把请求参数做一些定义的处理，然后再让你正式发送请求
// 客户端 -> 拦截器(请求参数) -> 服务器

// 响应式就是在后端返回的数据正式进入到客户端之前，把返回的数据拦截到做一些处理，然后再交给客户端
// 服务器 -> 拦截器(响应数据) ->  客户端

// 为什么要封装一个request.js?
// 原因：很多的配置都是统一生效的，很多接口都需要这些共同的处理 封装之后可以形成一个"一对多"的关系
// 封装了一个axios实例，管控了项目中所有的接口

// 如果项目中 ABC业务模块用的基地址是a.com  DEF业务模块用的基地址是b.com
// 方法：再来一个axios实例  axios.create() -> 全新的可以独立配置的实力对象

// const service1 = axios.create({
//   baseURL: 'b.com'
// })

export default service
