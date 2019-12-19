/*
 * @Description: api -> walletTolModule -> cloud
 * @Author: wangyun
 * @Date: 2019-11-11 16:30:03
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-12 10:35:19
 */
import request from '@/utils/request'

// 用户备份总览列表
export function getCloudList(params) {
  return request({
    url: '/apiUrl/api/cloud/backup/list',
    method: 'get',
    params
  })
}

// 查询用户链备份列表
export function getCloAccountList(params) {
  return request({
    url: '/apiUrl/api/cloud/backup/account/list',
    method: 'get',
    params
  })
}

// 查询用户账户备份详情列表
export function getCloAccountDetailList(params) {
  return request({
    url: '/apiUrl/api/cloud/backup/account/detail/list',
    method: 'get',
    params
  })
}

// 查询用户不同链下账户列表
export function getCloAccountChainList(params) {
  return request({
    url: '/apiUrl/api/cloud/backup/account/chain/list',
    method: 'get',
    params
  })
}


