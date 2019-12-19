/*
 * @Description: cas
 * @Author: wangyun
 * @Date: 2019-11-22 15:52:57
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-22 15:56:37
 */
import request from '@/utils/request'

/**
 * 应用管理
 */

export function getCasAppList(params) {
  return request({
    url: '/apiUrl/api/cas/application/list',
    method: 'get',
    params
  })
}

export function addCasApp(data) {
  return request({
    url: '/apiUrl/api/cas/application/add',
    method: 'post',
    data
  })
}

export function editCasApp(data) {
  return request({
    url: '/apiUrl/api/cas/application/edit',
    method: 'post',
    data
  })
}

export function deleteCasApp(data) {
  return request({
    url: '/apiUrl/api/cas/application/delete',
    method: 'post',
    data
  })
}

/**
 * 授权码发送记录
 */

export function getAuthCodeList(params) {
  return request({
    url: '/apiUrl/api/cas/authorization/code/history/list',
    method: 'get',
    params
  })
}

export function getAuthCodeSendList(params) {
  return request({
    url: '/apiUrl/api/cas/authorization/code/history/get/code',
    method: 'get',
    params
  })
}

/**
 * 用户管理
 */

export function getCasUserList(params) {
  return request({
    url: '/apiUrl/api/cas/customer/list',
    method: 'get',
    params
  })
}

/**
 * 积分管理
 */

export function getCasRecordList(params) {
  return request({
    url: '/apiUrl/api/cas/customer/score/record/list',
    method: 'get',
    params
  })
}

/**
 * 登录历史
 */

export function getLogHistoryList(params) {
  return request({
    url: '/apiUrl/api/cas/login/history/list',
    method: 'get',
    params
  })
}

/**
 * kyc获取国家列表
 */
export function getCountryList(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/getCountryList',
    method: 'get',
    params
  })
}

/**
 * kyc国家列表
 */
export function setCountry(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/setCountry',
    method: 'post',
    params
  })
}

/**
 * kyc用户信息列表
 */
export function kycInfoList(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/kycInfoList',
    method: 'get',
    params
  })
}

/**
 * kyc用户信息详情
 */
export function kycDetail(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/kycDetail',
    method: 'get',
    params
  })
}

/**
 * kyc信息审核设置:
 */
export function kycAudit(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/kycAudit',
    method: 'post',
    params
  })
}

/**
 * kyc信息校验:
 */
export function faceMatchAndPersonVerify(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/faceMatchAndPersonVerify',
    method: 'post',
    params
  })
}

/**
 * 审核意见说明:{
			分页列表展示：接口：/listAuditMessage
 */
export function listAuditMessage(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/listAuditMessage',
    method: 'get',
    params
  })
}


/**
 * 修改配置值:{	接口：/listAuditMessage}
 */
export function editAuditMessage(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/editAuditMessage',
    method: 'post',
    params
  })
}

/**
 * 增加配置值:{	接口：/listAuditMessage}
 */
export function addAuditMessage(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/addAuditMessage',
    method: 'post',
    params
  })
}

/**
 * 删除配置值:{	接口：/deleteAuditMessage}
 */
export function deleteAuditMessage(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/deleteAuditMessage',
    method: 'post',
    params
  })
}

/**
 * 用户kyc操作记录列表
 */
export function kyOperHistoryList(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/kyOperHistoryList',
    method: 'get',
    params
  })
}


/**
 * 用户kyc操作记录列表
 */
export function getSimilarFaceInFaceRepo(params) {
  return request({
    url: '/apiUrl/api/cas/kyc/getSimilarFaceInFaceRepo',
    method: 'get',
    params
  })
}




