/*
 * @Description: api -> walletTolModule -> chain
 * @Author: wangyun
 * @Date: 2019-11-25 14:42:25
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-25 14:44:45
 */
import request from '@/utils/request'

export function getChainList(params) {
  return request({
    url: '/apiUrl/api/chain/list',
    method: 'get',
    params
  })
}

export function addChain(data) {
  return request({
    url: '/apiUrl/api/chain/add',
    method: 'post',
    data
  })
}

export function editChain(data) {
  return request({
    url: '/apiUrl/api/chain/edit',
    method: 'post',
    data
  })
}

export function deleteChain(data) {
  return request({
    url: '/apiUrl/api/chain/delete',
    method: 'post',
    data
  })
}