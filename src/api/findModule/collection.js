/*
 * @Description: api -> findModule -> collection
 * @Author: wangyun
 * @Date: 2019-08-16 11:09:32
 * @LastEditTime: 2019-08-24 17:05:00
 */
import request from '@/utils/request'

export function getCollectionList(data) {
  return request({
    url: '/apiUrl/api/collection/list',
    method: 'post',
    data
  })
}

export function getCollectionDetail(data) {
  return request({
    url: '/apiUrl/api/collection/detail',
    method: 'post',
    data
  })
}

export function addCollection(data) {
  return request({
    url: '/apiUrl/api/collection/add',
    method: 'post',
    data
  })
}

export function editCollection(data) {
  return request({
    url: '/apiUrl/api/collection/edit',
    method: 'post',
    data
  })
}

export function deleteCollection(data) {
  return request({
    url: '/apiUrl/api/collection/delete',
    method: 'post',
    data
  })
}

export function getCollectionDapp(data) {
  return request({
    url: '/apiUrl/api/collection/simple/dapp/list',
    method: 'post',
    data
  })
} // 获取合集列表下的dapps

export function saveCollectionDapp(data) {
  return request({
    url: '/apiUrl/api/collection/dapp/rela/save',
    method: 'post',
    data
  })
} // 配置DApp