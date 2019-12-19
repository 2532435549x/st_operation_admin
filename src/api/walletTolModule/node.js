/*
 * @Description: api -> walletTolModule -> node
 * @Author: wangyun
 * @Date: 2019-09-09 16:44:57
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-09 17:34:46
 */
import request from '@/utils/request'

export function getNodesList(params) { // 查询链节点列表
  return request({
    url: '/apiUrl/api/nodes/list',
    method: 'post',
    data: params
  })
}

export function addNodesList(params) { // 添加链节点
  return request({
    url: '/apiUrl/api/nodes/add',
    method: 'post',
    data: params
  })
}

export function deleteNodesList(params) { // 删除链节点
  return request({
    url: '/apiUrl/api/nodes/delete',
    method: 'post',
    data: params
  })
}

export function editNodesList(params) { // 修改链节点
  return request({
    url: '/apiUrl/api/nodes/edit',
    method: 'post',
    data: params
  })
}