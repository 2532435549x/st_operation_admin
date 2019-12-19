/*
 * @Description: api -> findModule -> dappCategory
 * @Author: wangyun
 * @Date: 2019-08-16 14:27:04
 * @LastEditTime: 2019-08-24 17:07:29
 */

import request from '@/utils/request'

export function getCategoryList(data) {
  return request({
    url: '/apiUrl/api/category/list',
    method: 'post',
    data
  })
}

export function addCategory(data) {
  return request({
    url: '/apiUrl/api/category/add',
    method: 'post',
    data
  })
}

export function editCategory(data) {
  return request({
    url: '/apiUrl/api/category/edit',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/apiUrl/api/category/delete',
    method: 'post',
    data
  })
}

export function getClassifyDapp(data) {
  return request({
    url: '/apiUrl/api/category/simple/dapp/list',
    method: 'post',
    data
  })
} // 获取分类列表下的dapps

export function saveClassifyDapp(data) {
  return request({
    url: '/apiUrl/api/category/dapp/rela/save',
    method: 'post',
    data
  })
} // 保存分类列表下的dapps

// export function checkClassify(data) {
//   return request({
//     url: '/apiUrl/api/category/dapp/category',
//     method: 'post',
//     data
//   })
// } // 分类设置
