/*
 * @Description: api -> public
 * @Author: wangyun
 * @Date: 2019-11-28 15:42:56
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-28 15:48:03
 */
import request from '@/utils/request'

export function getChainsList(params) { // 查询App分类列表
  return request({
    url: '/apiUrl/api/chain/list/all',
    method: 'get',
    params
  })
}