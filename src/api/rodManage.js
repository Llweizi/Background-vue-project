import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @param { page, pageSize} params
 * @returns
 */
export function IntegratedRodListAPI(params) {
  return request({
    url: '/pole/info/list',
    params
  })
}
/**
 * 添加楼宇
 * @param {*} data
 * @returns
 */
export function addPoleAPI(data) {
  return request({
    url: '/pole/info',
    method: 'POST',
    data
  })
}
/**
 *
 * @param {*} data
 * @returns
 */
export function delListAPI(id) {
  return request({
    url: `/pole/info/{id}`,
    method: 'DELETE'
  })
}

export function editPoleAPI(data) {
  return request({
    url: `/pole/info`,
    method: 'PUT',
    data
  })
}

// 下拉列表
export function getxialaListAPI(data) {
  return request({
    url: '/parking/area/dropList',
    data
  })
}
