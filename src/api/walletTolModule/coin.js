/*
 * @Description: api -> walletTolModule -> coin
 * @Author: wangyun
 * @Date: 2019-08-13 14:47:36
 * @LastEditTime: 2019-11-11 14:44:44
 */
import request from '@/utils/request'

export function getCoinList(data) {
  return request({
    url: '/apiUrl/api/coin/list',
    method: 'post',
    data
  })
}

export function getCoinDetail(data) {
  return request({
    url: '/apiUrl/api/coin/detail',
    method: 'post',
    data
  })
}

export function addCoin(data) {
  return request({
    url: '/apiUrl/api/coin/add',
    method: 'post',
    data
  })
}

export function editCoin(data) {
  return request({
    url: '/apiUrl/api/coin/edit',
    method: 'post',
    data
  })
}

export function deleteCoin(data) {
  return request({
    url: '/apiUrl/api/coin/delete',
    method: 'post',
    data
  })
}

// 获取代币关联Dapp列表
export function getCoinDapp(data) {
  return request({
    url: '/apiUrl/api/coin/simple/dapp/list',
    method: 'post',
    data
  })
}

// 保存代币关联Dapp列表
export function saveCoinDapp(data) {
  return request({
    url: '/apiUrl/api/coin/dapp/rela/save',
    method: 'post',
    data
  })
}