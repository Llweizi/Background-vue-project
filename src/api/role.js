import request from '@/utils/request'
/**
 * 获取角色列表
 * @param { page, pageSize} params
 * @returns
 */
export function getRoleListAPI(params) {
  return request({
    url: '/park/sys/role',
    params
  })
}
export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`

  })
}

/**
 * 获取角色成员列表
 * @returns
 */
export function getRoleUserAPI(roleId) {
  return request({
    url: `/park/sys/roleUser/${roleId}`
  })
}
/**
 * 创建角色
 * @returns
 */
export function createRoleAPI(data) {
  return request({
    url: `/park/sys/role`,
    method: 'POST',
    data
  })
}
/**
 * 更新角色
 * @returns
 */
export function updateRoleAPI(data) {
  return request({
    url: '/park/sys/role',
    method: 'PUT',
    data
  })
}
export function getDetailAPI(roleId) {
  return request({
    url: `park/sys/role/${roleId}`,
    method: 'GET'
  })
}
