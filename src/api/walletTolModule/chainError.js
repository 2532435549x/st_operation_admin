/*
 * @Description: api -> walletTolModule -> chainError
 * @Author: wangyun
 * @Date: 2019-09-09 16:44:57
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-27 19:24:20
 */
import request from '@/utils/request'

export function getChainErrorList(params) { // 查询错误链信息列表
  return request({
    url: '/apiUrl/api/chain/error/dict/list',
    method: 'post',
    data: params
  })
}

export function addChainError(params) { // 添加错误链
  return request({
    url: '/apiUrl/api/chain/error/dict/add',
    method: 'post',
    data: params
  })
}

export function editChainError(params) { // 修改错误链
  return request({
    url: '/apiUrl/api/chain/error/dict/edit',
    method: 'post',
    data: params
  })
}

export function deleteChainError(params) { // 删除错误链
  return request({
    url: '/apiUrl/api/chain/error/dict/delete',
    method: 'post',
    data: params
  })
}

