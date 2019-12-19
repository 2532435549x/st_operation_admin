/*
 * @Description: api -> findModule -> dapp
 * @Author: wangyun
 * @Date: 2019-08-15 16:10:30
 * @LastEditTime: 2019-11-16 10:10:42
 */
import request from '@/utils/request'

// 获取DApp列表
export function getDappList(data) {
  return request({
    url: '/apiUrl/api/app/list',
    method: 'post',
    data
  })
}


// 获取DApp详情
export function getDappDetail(data) {
  return request({
    url: '/apiUrl/api/app/detail',
    method: 'post',
    data
  })
}

// 编辑DApp
export function editDapp(data) {
  return request({
    url: '/apiUrl/api/app/edit',
    method: 'post',
    data
  })
}

// 下架
export function removeDapp(data) {
  return request({
    url: '/apiUrl/api/app/setOffStatus',
    method: 'post',
    data
  })
} 

// 审核通过
export function auditPassDapp(data) {
  return request({
    url: '/apiUrl/api/app/auditPass',
    method: 'post',
    data
  })
} 

// 审核驳回
export function auditRejectDapp(data) {
  return request({
    url: '/apiUrl/api/app/auditReject',
    method: 'post',
    data
  })
} 

// 删除dapp
export function deleteDapp(data) {
  return request({
    url: '/apiUrl/api/app/delete',
    method: 'post',
    data
  })
} 

// 评论列表
export function getCommentList(data) {
  return request({
    url: '/apiUrl/api/appComment/list',
    method: 'post',
    data
  })
} 





