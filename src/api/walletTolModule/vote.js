/*
 * @Description: apis -> vote
 * @Author: wangyun
 * @Date: 2019-11-20 14:41:30
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-20 15:06:30
 */
import request from '@/utils/request'


/**
 * description: nodeVote
 * 
*/

export function getNodeVoteList(params) {
  return request({
    url: '/apiUrl/api/producerInfo/list',
    method: 'get',
    params
  })
}

export function addNodeVote(data) {
  return request({
    url: '/apiUrl/api/producerInfo/add',
    method: 'post',
    data
  })
}

export function editNodeVote(data) {
  return request({
    url: '/apiUrl/api/producerInfo/edit',
    method: 'post',
    data
  })
}


export function deleteNodeVote(data) {
  return request({
    url: '/apiUrl/api/producerInfo/delete',
    method: 'post',
    data
  })
}


/**
 * description: proxyVote
 * 
*/

export function getProxyVoteList(data) {
  return request({
    url: '/apiUrl/api/proxyVote/list',
    method: 'post',
    data
  })
}

export function getProxyVoteDeteail(data) {
  return request({
    url: '/apiUrl/api/proxyVote/detail',
    method: 'post',
    data
  })
}

// 审核通过
export function auditPassProxyVote(data) {
  return request({
    url: '/apiUrl/api/proxyVote/auditPass',
    method: 'post',
    data
  })
}

// 审核驳回
export function auditRejectProxyVote(data) {
  return request({
    url: '/apiUrl/api/proxyVote/auditReject',
    method: 'post',
    data
  })
} 

// 更新顺序
export function getProxyVoteSort(data) {
  return request({
    url: '/apiUrl/api/proxyVote/sort',
    method: 'post',
    data
  })
}