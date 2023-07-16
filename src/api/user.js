import request from '@/utils/request'

// 登录函数
// 函数 参数 + 函数逻辑 + 返回值
/**
 * @description: 登录函数
 * @param {*} data { username,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  // 1. 使用request发送网络请求
  // 2. 把request函数执行的结果当成返回值返回 （promise）
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

// login().then(res => console.log(res)) // promise

// 测试接口

export function testAPI() {
  return request({
    url: '/system/user/dropList',
    method: 'GET'
  })
}
/**
 * @description: 获取用户信息
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function getProfileAPI() {
  return request({
    url: '/park/user/profile',
    method: 'GET'
  })
}
