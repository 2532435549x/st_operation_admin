/*
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-07-29 09:48:29
 * @LastEditTime: 2019-08-13 14:06:18
 */
import request from '@/utils/request'

export function getSysUserDetail(params) { // 查询App分类列表
  return request({
    url: '/apiUrl/api/category/list',
    method: 'post',
    data: params
  })
} // config/detail

export function addSysUserDetail(params) { // 添加App分类
  return request({
    url: '/apiUrl/api/category/add',
    method: 'post',
    data: params
  })
} // config/detail

export function deleteSysUserDetail(params) { // 删除App分类
  return request({
    url: '/apiUrl/api/category/delete',
    method: 'post',
    data: params
  })
} // config/detail

export function editSysUserDetail(params) { // 修改APP分类
  return request({
    url: '/apiUrl/api/category/edit',
    method: 'post',
    data: params
  })
} // config/detail
