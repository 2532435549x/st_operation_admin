/*
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-07-29 09:48:29
 * @LastEditTime: 2019-08-13 14:07:27
 */
import request from '@/utils/request'

export function getdapps(params) { // dapp列表
  return request({
    url: '/apiUrl/api/app/list',
    method: 'post',
    data: params
  })
} // getdapps

export function getdappsDetail(params) { // dapp详情
  return request({
    url: '/apiUrl/api/app/detail',
    method: 'post',
    data: params
  })
} // getdapps

export function cancelDapp(params) { // 下架dapp
  return request({
    url: '/apiUrl/api/app/setOffStatus',
    method: 'post',
    data: params
  })
} // getdapps

export function auditFailed(params) { // 驳回dapp
  return request({
    url: '/apiUrl/api/app/auditReject',
    method: 'post',
    data: params
  })
} // getdapps

export function Dapproved(params) { // 通过dapp
  return request({
    url: '/apiUrl/api/app/auditPass',
    method: 'post',
    data: params
  })
} // getdapps

export function coinList(params) { // 代币列表查询
  return request({
    url: '/apiUrl/api/coin/list',
    method: 'post',
    data: params
  })
} // getdapps

export function coinDetail(params) { // 获取代币详情
  return request({
    url: '/apiUrl/api/coin/detail',
    method: 'post',
    data: params
  })
} // getdapps

export function addCoin(params) { // 添加代币
  return request({
    url: '/apiUrl/api/coin/add',
    method: 'post',
    data: params
  })
} // getdapps

export function editCoin(params) { // 修改代币信息
  return request({
    url: '/apiUrl/api/coin/edit',
    method: 'post',
    data: params
  })
} // getdapps

export function deleteCoin(params) { // 删除代币信息
  return request({
    url: '/apiUrl/api/coin/delete',
    method: 'post',
    data: params
  })
} // getdapps
