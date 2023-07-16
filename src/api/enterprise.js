import request from '@/utils/request'

/**
 * @description: 获取企业列表
 * @param {*} data { page,pageSize,name}
 * @return {*} promise
 */
export function getExterpriseListAPI(params) {
  // 1. 使用request发送网络请求
  // 2. 把request函数执行的结果当成返回值返回 （promise）
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}

/**
 * 获取行业列表
 * @returns
 */
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 上传
 * @param {*} data
 * @returns
 */
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
/**
 * 创建公司
 * @param {*} data
 * @returns
 */
export function createExterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 获取合同详情
 * @param {*} id
 * @returns
 */
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export function updateExterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

/**
 * 获取合同列表
 * @param {*} id
 * @returns
 */
export function getRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}

/**
 * 获取楼宇列表
 * @param {*} id
 * @returns
 */
export function getRentBuildListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 创建合同
 * @param {*}
 * @returns
 */
export function createRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 退租
 * @param {合同id} rentId
 * @returns
 */

export function outRentAPI(rentId) {
  return request({
    url: `/park/enterprise/rent/${rentId}`,
    method: 'PUT'
  })
}