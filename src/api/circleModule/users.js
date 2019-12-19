/*
 * @Description: api -> circleModule -> users
 * @Author: wangyun
 * @Date: 2019-08-30 19:08:57
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-18 16:15:55
 */

import request from '@/utils/request'

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/apiUrl/api/community/customer/info/list',
    method: 'post',
    data
  })
}

// 获取用户详情
export function getUserDetail(data) {
  return request({
    url: '/apiUrl/api/community/customer/info/detail',
    method: 'post',
    data
  })
}

// 获取全部标签列表(保存使用)
export function getUserLabelTotal(params) {
  return request({
    url: '/apiUrl/api/community/customer/info/label/list',
    method: 'get',
    params
  })
}

// 获取用户已有标签
export function getUserLabel(data) {
  return request({
    url: '/apiUrl/api/community/customer/info/labels',
    method: 'post',
    data
  })
}

// 保存用户标签
export function saveUserLabel(data) {
  return request({
    url: '/apiUrl/api/community/customer/info/label/save',
    method: 'post',
    data
  })
}

