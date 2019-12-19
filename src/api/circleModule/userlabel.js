/*
 * @Description: api -> circleModule -> userlabel
 * @Author: wangyun
 * @Date: 2019-09-02 15:38:38
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-14 18:13:46
 */
import request from '@/utils/request'

// 用户标签
export function getUserLabelList(data) {
  return request({
    url: '/apiUrl/api/community/customer/label/list',
    method: 'post',
    data
  })
}

export function addUserLabel(data) {
  return request({
    url: '/apiUrl/api/community/customer/label/add',
    method: 'post',
    data
  })
}

export function editUserLabel(data) {
  return request({
    url: '/apiUrl/api/community/customer/label/edit',
    method: 'post',
    data
  })
}

export function deleteUserLabel(data) {
  return request({
    url: '/apiUrl/api/community/customer/label/delete',
    method: 'post',
    data
  })
}