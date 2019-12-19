/*
 * @Description: api -> AppVersionModule
 * @Author: wangyun
 * @Date: 2019-08-13 10:44:44
 * @LastEditTime: 2019-08-13 14:30:39
 */
import request from '@/utils/request'

export function getAppList(data) {   //获取版本列表
  return request({
    url: '/apiUrl/api/appVersion/list',
    method: 'post',
    data
  })
}

export function getAppVersionDetail(data) {  //获取版本详情
  return request({
    url: '/apiUrl/api/appVersion/detail',
    method: 'post',
    data
  })
}

export function deleteAppVersion(data) {   //删除钱包版本
  return request({
    url: '/apiUrl/api/appVersion/delete',
    method: 'post',
    data
  })
}

export function saveAppVersion(params) {   //保存钱包版本
  return request({
    url: '/apiUrl/api//appVersion/save',
    method: 'post',
    data:params
  })
}