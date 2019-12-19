import request from '@/utils/request'

export function getUserList(params) { // 获取开发人员列表
  return request({
    url: '/apiUrl/api/developers/list',
    method: 'post',
    data: params
  })
} // config/detail

export function lockUser(params) { // 设置开发人员解锁开锁
  return request({
    url: '/apiUrl/api/developers/lockOrUnlock',
    method: 'post',
    data: params
  })
} // config/detail

export function getSystemUser(params) { // 查询系统用户列表
  return request({
    url: '/apiUrl/api/user/list',
    method: 'post',
    data: params
  })
} // config/detail

export function lockSysUser(params) { // 设置系统用户解锁开锁
  return request({
    url: '/apiUrl/api/user/lockUser',
    method: 'post',
    data: params
  })
} // config/detail

export function addSysUser(params) { // 添加系统用户
  return request({
    url: '/apiUrl/api/user/add',
    method: 'post',
    data: params
  })
} // config/detail

export function getSysUserDetail(params) { // 查看系统用户详情
  return request({
    url: '/apiUrl/api/user/detail',
    method: 'post',
    data: params
  })
} // config/detail

export function editSysUserDetail(params) { // 修改系统用户
  return request({
    url: '/apiUrl/api/user/edit',
    method: 'post',
    data: params
  })
} // config/detail

export function deleteSysUser(params) { // 删除系统用户
  return request({
    url: '/apiUrl/api/user/delete',
    method: 'post',
    data: params
  })
} // config/detail

export function getRoleList(params) { // 查询系统角色列表
  return request({
    url: '/apiUrl/api/role/list',
    method: 'post',
    data: params
  })
} // config/detail

export function changeRole(params) { // 修改系统角色
  return request({
    url: '/apiUrl/api/role/edit',
    method: 'post',
    data: params
  })
} // config/detail

export function deleteRole(params) { // 删除系统角色
  return request({
    url: '/apiUrl/api/role/delete',
    method: 'post',
    data: params
  })
} // config/detail

export function addRole(params) { // 添加系统角色
  return request({
    url: '/apiUrl/api/role/add',
    method: 'post',
    data: params
  })
} // config/detail
