import request from '@/utils/request'

export function getKeywordsList(params) { // 获取搜索关键字列表
  return request({
    url: '/apiUrl/api/popularSearchWord/list',
    method: 'post',
    data: params
  })
} // getKeywordsList

export function modifyKeywords(params) { // 修改取搜索关键字
  return request({
    url: '/apiUrl/api/popularSearchWord/edit',
    method: 'post',
    data: params
  })
} // getKeywordsList

export function deleteKeywords(params) { // 删除取搜索关键字
  return request({
    url: '/apiUrl/api/popularSearchWord/delete',
    method: 'post',
    data: params
  })
} // getKeywordsList

export function addKeywords(params) { // 添加搜索关键字
  return request({
    url: '/apiUrl/api/popularSearchWord/add',
    method: 'post',
    data: params
  })
} // getKeywordsList



// v2 admin-------------------------------------------------

export function getTweetList(params) { // 获取发现推文列表
  return request({
    url: '/apiUrl/api/tweet/list',
    method: 'post',
    data: params
  })
} // getTweetList

export function addTweet(params) { // 新增推文
  return request({
    url: '/apiUrl/api/tweet/add',
    method: 'post',
    data: params
  })
} // addTweet

export function getAppList(params) { // dapp列表
  return request({
    url: '/apiUrl/api/app/list',
    method: 'post',
    data: params
  })
} // getAppList


export function searchTweetList(params) { // 搜索推文
  return request({
    url: '/apiUrl/api/tweet/list',
    method: 'post',
    data: params
  })
} // searchTweetList


export function getTweetDetail(params) { // 获取详情
  return request({
    url: '/apiUrl/api/tweet/detail',
    method: 'post',
    data: params
  })
} // getTweetDetail

export function deleteTweet(params) { // 删除文章
  return request({
    url: '/apiUrl/api/tweet/delete',
    method: 'post',
    data: params
  })
} // deleteTweet


export function editTweet(params) { // 编辑推文
  return request({
    url: '/apiUrl/api//tweet/edit',
    method: 'post',
    data: params
  })
} // editTweet

