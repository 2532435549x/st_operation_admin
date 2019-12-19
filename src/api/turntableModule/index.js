/*
* @Description: mining apis
* @Author: wangyun
* @Date: 2019-07-29 15:57:48
 * @LastEditTime: 2019-08-13 17:09:30
*/
import request from '@/utils/request'

export function getPrizeList(data, notLoading) {
  return request({
    url: '/turntableUrl/api/turntable/prize/list',
    method: 'post',
    data,
    notLoading: true
  })
}
export function addPrize(data) {
  return request({
    url: '/turntableUrl/api/turntable/prize/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 编辑问题

export function editPrize(data) {
  return request({
    url: '/turntableUrl/api/turntable/prize/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }	
  })
} // 新增问题

export function getPrizeDetail(data) {
  return request({
    url: '/turntableUrl/api/turntable/prize/detail',
    method: 'post',
    data
  })
} // 问题详情

export function deletePrize(data) {
  return request({
    url: '/turntableUrl/api/turntable/prize/del',
    method: 'post',
    data
  })
} // 问题详情


//查询模块

export function searchHistory(data) {
  return request({
    url: '/turntableUrl/api/turntable/history/list',
    method: 'post',
    data
  })
} 
// 中奖记录

export function sendPrize(data) {
  return request({
    url: '/turntableUrl/api/turntable/history/update',
    method: 'post',
    data
  })
} // 发货


//合约配置模块
export function getContractList(data) {
  return request({
    url: '/turntableUrl/api/turntable/coin/config/list',
    method: 'post',
    data
  })
} // 合约列表
export function deleteContract(data) {
  return request({
    url: '/turntableUrl/api/turntable/coin/config/del',
    method: 'post',
    data
  })
} // 删除合约
export function getContractDetail(data) {
  return request({
    url: '/turntableUrl/api/turntable/coin/config/detail',
    method: 'post',
    data
  })
} // 合约详情
export function addContract(data) {
  return request({
    url: '/turntableUrl/api/turntable/coin/config/add',
    method: 'post',
    data
  })
} // 添加合约
export function editContract(data) {
  return request({
    url: '/turntableUrl/api/turntable/coin/config/update',
    method: 'post',
    data
  })
} // 编辑合约

//主体配置

export function getConfigDetail(data) {
  return request({
    url: '/turntableUrl/api/turntable/prize/game/list',
    method: 'post',
    data
  })
} // 查看配置

export function editConfig(data) {
  return request({
    url: '/turntableUrl/api/turntable/prize/game/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 编辑合约