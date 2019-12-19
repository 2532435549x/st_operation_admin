/*
* @Description: mining apis
* @Author: wangyun
* @Date: 2019-07-29 15:57:48
 * @LastEditTime: 2019-08-13 17:09:30
*/
import request from '@/utils/request'

export function getGameList(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/list/list',
    method: 'post',
    data
  })
} // 游戏列表

export function getQuestionList(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/list',
    method: 'post',
    data
  })
} // 题库列表

export function deleteGame(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/list/del',
    method: 'post',
    data
  })
} // 删除游戏

export function addGame (data) {
  return request({
    url: '/mindkingUrl/api/answer/game/list/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 新增游戏

export function editGame(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/list/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 编辑游戏

export function gameDetail(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/list/details',
    method: 'post',
    data
  })
} // 游戏详情

export function deleteQuestion(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/del',
    method: 'post',
    data
  })
} // 删除问题

export function addQuestion(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 编辑问题

export function editQuestion(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 新增问题

export function questionDetail(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/details',
    method: 'post',
    data
  })
} // 问题详情

export function getByIdQuestion(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/game/getByIdQuestion',
    method: 'post',
    data
  })
} // 匹配题库

export function addGameQuestion(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/game/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 游戏添加题目

export function delGameQuestion(data) {
  return request({
    url: '/mindkingUrl/api/answer/game/question/game/del',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 游戏取消题目






