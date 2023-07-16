import request from '@/utils/request'

export function getPropetyListAPI(params) {
  return request({
    url: '/park/propertyfee',
    params
  })
}
export function delPropertyFeeAPI(id) {
  return request({
    url: `/park/propertyfee/{id}`,
    method: 'DELETE'
  })
}

export function addBillAPI(data) {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data
  })
}

export function enterpriseListAPI() {
  return request({
    url: '/park/enterprise'

  })
}
export function buildingListAPI() {
  return request({
    url: '/park/all/building'

  })
}
export function paymentAPI(data) {
  return request({
    url: '/park/propertyfee/pre/payment',
    method: 'POST',
    data
  })
}
