/*
 * @Description: api -> resourceRent -> order
 * @Author: wangyun
 * @Date: 2019-11-07 16:35:26
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-09 18:11:55
 */
import request from '@/utils/request'

// 资源租赁订单列表
export function resRentOrderList(params) {
  return request({
    url: '/apiUrl/api/orderRecord/res/set/list',
    method: 'get',
    params
  })
}

// 资源租赁订单详情
export function resRentOrderDetail(params) {
  return request({
    url: '/apiUrl/api/orderRecord/res/set/detail',
    method: 'get',
    params
  })
}

// 账号注册订单
export function regAccountOrderList(params) {
  return request({
    url: '/apiUrl/api/orderRecord/account/reg/list',
    method: 'get',
    params
  })
}

// 账号注册订单详情
export function regAccountOrderDetail(params) {
  return request({
    url: '/apiUrl/api/orderRecord/account/reg/detail',
    method: 'get',
    params
  })
}

// 账号注册邀请码订单
export function codeAccountOrderList(params) {
  return request({
    url: '/apiUrl/api/orderRecord/account/code/list',
    method: 'get',
    params
  })
}

// 账号注册邀请码订单详情
export function codeAccountOrderDetail(params) {
  return request({
    url: '/apiUrl/api/orderRecord/account/code/detail',
    method: 'get',
    params
  })
}

// 添加订单备注
export function orderRemark(data) {
  return request({
    url: '/apiUrl/api/orderRecord/add/remark',
    method: 'post',
    data
  })
}