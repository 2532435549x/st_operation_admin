/*
 * @Description: api -> resourceRent -> items
 * @Author: wangyun
 * @Date: 2019-11-06 15:13:15
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-07 14:09:32
 */
import request from '@/utils/request'

export function getResourceItemList(data) {
  return request({
    url: '/apiUrl/api/resourceItem/list',
    method: 'post',
    data
  })
}

export function getResourceItemDetail(data) {
  return request({
    url: '/apiUrl/api/resourceItem/detail',
    method: 'post',
    data
  })
}

export function addResourceItem(data) {
  return request({
    url: '/apiUrl/api/resourceItem/add',
    method: 'post',
    data
  })
}

export function editResourceItem(data) {
  return request({
    url: '/apiUrl/api/resourceItem/edit',
    method: 'post',
    data
  })
}