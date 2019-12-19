/*
 * @Description: api -> resourceRent -> group
 * @Author: wangyun
 * @Date: 2019-11-06 15:13:15
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-07 13:53:16
 */

import request from '@/utils/request'

export function getResourceGroupList(data) {
  return request({
    url: '/apiUrl/api/resourceGroup/list',
    method: 'post',
    data
  })
}

export function getResourceGroupDetail(data) {
  return request({
    url: '/apiUrl/api/resourceGroup/detail',
    method: 'post',
    data
  })
}

export function addResourceGroup(data) {
  return request({
    url: '/apiUrl/api/resourceGroup/add',
    method: 'post',
    data
  })
}

export function editResourceGroup(data) {
  return request({
    url: '/apiUrl/api/resourceGroup/edit',
    method: 'post',
    data
  })
}

// 获取资源项列表
export function getResourceGroupItems(data) {
  return request({
    url: '/apiUrl/api/resourceGroup/items',
    method: 'post',
    data
  })
}