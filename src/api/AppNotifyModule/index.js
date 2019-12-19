/*
 * @Description: api -> AppNotifyModule
 * @Author: wangyun
 * @Date: 2019-07-29 09:48:29
 * @LastEditTime: 2019-09-28 11:21:36
 */
import request from '@/utils/request'

// App通知列表查询
export function getDappNotifyList(params) {
  return request({
    url: '/apiUrl/api/appNotify/list',
    method: 'post',
    data: params
  })
}

// 获取App通知详情
export function getDappNotifyDetail(params) {
  return request({
    url: '/apiUrl/api/appNotify/detail',
    method: 'post',
    data: params
  })
}

// 添加App通知
export function addDappNotify(params) {
  return request({
    url: '/apiUrl/api/appNotify/add',
    method: 'post',
    data: params
  })
}

// 修改App通知
export function editDappNotify(params) {
  return request({
    url: '/apiUrl/api/appNotify/edit',
    method: 'post',
    data: params
  })
}

// 删除App通知
export function deleteDappNotify(params) {
  return request({
    url: '/apiUrl/api/appNotify/delete',
    method: 'post',
    data: params
  })
}

// 获取Dapp列表
export function getDappNotifyApps(params) {
  return request({
    url: '/apiUrl/api/appNotify/apps',
    method: 'post',
    data: params
  })
}

// 富文本上传图片
export function uploadImageNotify(params) {
  return request({
    url: '/apiUrl/api/common/ue/uploadImage?type=5',
    method: 'post',
    data: params
  })
} 

