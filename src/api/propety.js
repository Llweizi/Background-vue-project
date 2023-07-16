import request from '@/utils/request'

// 物业费管理列表
export function getPropetyListAPI(params) {
  return request({
    url: '/park/propertyfee',
    params
  })
}

// 查询可租赁楼宇
export function buildingListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

// 企业列表
export function enterpriseListApI() {
  return request({
    url: '/park/enterprise'
  })
}

// 预算金额
export function paymentAPI(data) {
  return request({
    url: '/park/propertyfee/pre/payment',
    method: 'POST',
    data
  })
}

// 添加账单
export function addBillAPI(data) {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data
  })
}
