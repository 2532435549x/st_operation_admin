/*
 * @Description: api -> circleModule -> news
 * @Author: wangyun
 * @Date: 2019-09-02 15:45:01
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-19 17:47:47
 */
import request from '@/utils/request'

/**
 * @description: NewPost NewComment apis
 */


// 获取最新帖子列表
export function getNewPostList(data) {
  return request({
    url: '/apiUrl/api/community/lately/post/list',
    method: 'post',
    data,
    notLoading: true
  })
}

// 获取最新评论列表
export function getNewCommentList(data) {
  return request({
    url: '/apiUrl/api/community/lately/comment/list',
    method: 'post',
    data,
    notLoading: true
  })
}


/**
 * @description: Post  apis 
 */


// 获取全部帖子列表
export function getPostList(data) {
  return request({
    url: '/apiUrl/api/community/post/list',
    method: 'post',
    data,
    notLoading: true
  })
}

// 删除帖子
export function deletePost(data) {
  return request({
    url: '/apiUrl/api/community/post/delete',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 帖子标记已读
export function tagRead(data) {
  return request({
    url: '/apiUrl/api/community/post/read',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 帖子标记全部已读
export function tagReadAll(data) {
  return request({
    url: '/apiUrl/api/community/post/read/all',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 置顶帖子
export function topPost(data) {
  return request({
    url: '/apiUrl/api/community/post/top',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 取消置顶帖子
export function unTopPost(data) {
  return request({
    url: '/apiUrl/api/community/post/unTop',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 获取帖子详情
export function getPostDetail(data) {
  return request({
    url: '/apiUrl/api/community/post/detail',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 获取打赏列表
export function getRewardList(data) {
  return request({
    url: '/apiUrl/api/community/post/score/list',
    method: 'post',
    data
  })
}

// 获取帖子评论
export function getPostCommentList(data) {
  return request({
    url: '/apiUrl/api/community/post/comments/list',
    method: 'post',
    data
  })
}


/**
 * @description: Comment apis
 */


// 获取全部评论列表
export function getCommentList(data) {
  return request({
    url: '/apiUrl/api/community/post/comment/list',
    method: 'post',
    data,
    notLoading: true
  })
}

// 删除评论
export function deleteComment(data) {
  return request({
    url: '/apiUrl/api/community/post/comment/delete',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 评论标记已读
export function tagComRead(data) {
  return request({
    url: '/apiUrl/api/community/post/comment/read',
    method: 'post',
    data,
    // notLoading: true
  })
}

// 评论标记全部已读
export function tagComReadAll(data) {
  return request({
    url: '/apiUrl/api/community/post/comment/read/all',
    method: 'post',
    data,
  })
}

// 设置神评
export function setComHot(data) {
  return request({
    url: '/apiUrl/api/community/post/comment/hot',
    method: 'post',
    data,
  })
}

// 回复操作
export function replyCom(data) {
  return request({
    url: '/apiUrl/api/community/post/comment/publish',
    method: 'post',
    data,
  })
}






