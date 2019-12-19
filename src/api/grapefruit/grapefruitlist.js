/*
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:45:35
 * @LastEditTime: 2019-09-10 16:05:38
 * @LastEditors: xcq
 */
import request from '@/utils/request'

export function orderList(params) { // 列表
  return request({
    url: '/apiUrl/api/eosmall/orderDetail/list',
    method: 'get',
    params: params
  })
} // config/detail

export function orderShip(params) { // 列表发货
  return request({
    url: '/apiUrl/api/eosmall/orderDetail/ship',
    method: 'post',
    data: params
  })
} // config/detail

export function orderDetail(params) { // 列表
  return request({
    url: '/apiUrl/api/eosmall/orderDetail/detail',
    method: 'post',
    data: params
  })
} // config/detail

export function operationLog(params) { // =logs
  return request({
    url: '/apiUrl/api/eosmall/operationLog/list',
    method: 'get',
    params: params
  })
} // config/detail

export function message(params) { // 消息模块列表
  return request({
    url: '/apiUrl/api/eosmall/message/list',
    method: 'get',
    params: params
  })
} // config/detail

export function setMessageRead(params) { // 消息状态
  return request({
    url: '/apiUrl/api/eosmall//message/setMessageRead',
    method: 'post',
    data: params
  })
}

export function goodsList(params) { // 商品列表
  return request({
    url: '/apiUrl/api/eosmall/goods/list',
    method: 'get',
    params: params
  })
} // config/detail

export function goodsAdd(params) { // 添加商品
  return request({
    url: '/apiUrl/api/eosmall/goods/save',
    method: 'post',
    data: params
  })
} // config/detai

export function goodsDetail(params) { // 商品详情
  return request({
    url: '/apiUrl/api/eosmall/goods/detail',
    method: 'post',
    data: params
  })
} // config/detail

export function goodsDelete(params) { // 删除商品
  return request({
    url: '/apiUrl/api/eosmall/goods/logicDelete',
    method: 'post',
    data: params
  })
} // config/detail
// 地址
export function addressList(params) { // 地址列表
  return request({
    url: '/apiUrl/api/eosmall/address/list',
    method: 'get',
    params: params
  })
} // config/detail

export function getSupportPaymentType(params) { // 支付方式列表
  return request({
    url: '/apiUrl/api/eosmall/goods/getSupportPaymentType',
    method: 'post',
    data: params
  })
} // config/detail

// 品牌
export function brandList(params) { // 品牌列表
  return request({
    url: '/apiUrl/api/eosmall/brand/list',
    method: 'get',
    params: params
  })
}
// 品牌
export function brandListAll(params) { // 品牌列表
  return request({
    url: '/apiUrl/api/eosmall/brand/listAll',
    method: 'get',
    params: params
  })
}

export function brandDetail(params) { // 品牌详情
  return request({
    url: '/apiUrl/api/eosmall/brand/detail',
    method: 'post',
    data: params
  })
}

export function brandDelete(params) { // 删除品牌
  return request({
    url: '/apiUrl/api/eosmall/brand/delete',
    method: 'post',
    data: params
  })
}

export function brandAdd(params) { // 添加品牌
  return request({
    url: '/apiUrl/api/eosmall/brand/add',
    method: 'post',
    data: params
  })
}

export function brandEdit(params) { // 编辑品牌
  return request({
    url: '/apiUrl/api/eosmall/brand/edit',
    method: 'post',
    data: params
  })
}

export function changeStatusGoods(params) { // 编辑品牌
  return request({
    url: '/apiUrl/api/eosmall/goods/setIsOnSale',
    method: 'post',
    data: params
  })
}

// 分类
export async function categoryList(params) { // 分类列表
  return request({
    url: '/apiUrl/api/eosmall/category/list',
    method: 'get',
    params: params
  })
}

export function categoryDetail(params) { // 分类详情
  return request({
    url: '/apiUrl/api/eosmall/category/detail',
    method: 'post',
    data: params
  })
}

export function categoryDelete(params) { // 删除分类
  return request({
    url: '/apiUrl/api/eosmall/category/delete',
    method: 'post',
    data: params
  })
}

export function categoryList1(params) { // 一级分类
  return request({
    url: '/apiUrl/api/eosmall/category/l1',
    method: 'post',
    data: params
  })
}

export function categoryAdd(params) { // 添加分类 或者编辑
  return request({
    url: '/apiUrl/api/eosmall/category/save',
    method: 'post',
    data: params
  })
}

// 上传图片
export function uploadImage(params) { //
  return request({
    url: '/apiUrl/api/eosmall/file/uploadImage',
    method: 'post',
    data: params
  })
}
// banner管理

// 上传banner
export function resourceList(params) { //
  return request({
    url: '/apiUrl/api/eosmall/resource/list',
    method: 'get',
    params: params
  })
}

// 修改banner
export function resourceSave(params) { //
  return request({
    url: '/apiUrl/api/eosmall/resource/save',
    method: 'post',
    data: params
  })
}

// 删除banner
export function resourceDelete(params) { //
  return request({
    url: '/apiUrl/api/eosmall/resource/delete',
    method: 'post',
    data: params
  })
}

// 查看看banner
export function resourceDetail(params) {
  return request({
    url: '/apiUrl/api/eosmall/resource/detail',
    method: 'post',
    data: params
  })
}

// 导出表格
export function exportExcelAll(params) {
  return request({
    url: '/apiUrl/api/eosmall/file/exportExcelAll',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 导出表格
export function exportExcelShip(params) {
  return request({
    url: '/apiUrl/api/eosmall/file/exportExcelShip',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 导出表格
export function exportExcelFinancial(params) {
  return request({
    url: '/apiUrl/api/eosmall/file/exportExcelFinancial',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

export function configurationsList(params) {
  return request({
    url: '/apiUrl/api/eosmall/configurations/list',
    method: 'post',
    data: params
  })
}

export function configurationsEdit(params) {
  return request({
    url: '/apiUrl/api/eosmall/configurations/editValue',
    method: 'post',
    data: params
  })
}

// 快递公司
export function listShipChannel(params) {
  return request({
    url: '/apiUrl/api/eosmall/configurations/listShipChannel',
    method: 'post',
    data: params
  })
}

// 快递公司
export function addShipChannel(params) {
  return request({
    url: '/apiUrl/api/eosmall/configurations/addShipChannel',
    method: 'post',
    data: params
  })
}

// 快递公司
export function editShipChannel(params) {
  return request({
    url: '/apiUrl/api/eosmall/configurations/editShipChannel',
    method: 'post',
    data: params
  })
}
// 快递公司
export function deleteShipChannel(params) {
  return request({
    url: '/apiUrl/api/eosmall/configurations/deleteShipChannel',
    method: 'post',
    data: params
  })
}

