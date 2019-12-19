import request from '@/utils/request'

export function getdapps(params) { // dapp列表
  return request({
    url: '/apiUrl/api/app/list',
    method: 'post',
    data: params
  })
} // getdapps

export function getdappsDetail(params) { // dapp详情
  return request({
    url: '/apiUrl/api/app/detail',
    method: 'post',
    data: params
  })
} // getdapps

export function cancelDapp(params) { // 下架dapp
  return request({
    url: '/apiUrl/api/app/setOffStatus',
    method: 'post',
    data: params
  })
} // getdapps

export function auditFailed(params) { // 驳回dapp
  return request({
    url: '/apiUrl/api/app/auditReject',
    method: 'post',
    data: params
  })
} // getdapps

export function Dapproved(params) { // 通过dapp
  return request({
    url: '/apiUrl/api/app/auditPass',
    method: 'post',
    data: params
  })
} // getdapps
export function appModificationLimit(params) { // 高亮app显示
  return request({
    url: '/apiUrl/api/app/appModificationLimitInfo',
    method: 'post',
    data: params
  })
} // getdapps

export function configurations(params) { // 配置列表查询：
  return request({
    url: '/apiUrl/api/configurations/list',
    method: 'post',
    data: params
  })
} // getdapps

export function editValue(params) { // 配置列表查询：
  return request({
    url: '/apiUrl/api/configurations/editValue',
    method: 'post',
    data: params
  })
} // getdapps

export function resetAppModificationLimit(params) { // 配置列表查询：
  return request({
    url: '/apiUrl/api/configurations/resetAppModificationLimit',
    method: 'post',
    data: params
  })
} // getdapps

export function editAppModificationLimitUsedTimes(params) { // 修改单个APp次数限制
  return request({
    url: '/apiUrl/api/app/editAppLanguageModificationLimitUsedTimes',
    method: 'post',
    data: params
  })
} // getdapps
