/*
 * @Description: Routing module @devPlatformRouter
 * @Author: wangyun
 * @Date: 2019-08-07 15:16:05
 * @LastEditTime: 2019-09-02 10:46:27
 */

import Layout from '@/layout/Layout'

const devPlatformRouter = {
  path: '/devPlatform',
  name: 'DevPlatform',
  component: Layout,
  redirect: '/devPlatform/developer',
  meta: {
    title: '开发者平台管理',
    icon: 'tree'
  },
  children: [
    {
      path: 'developer',
      name: 'DevPlatform-developer',
      component: () => import('@/views/devPlatform/developer'),
      meta: {
        title: '开发者管理',
        icon: 'list'
      }
    },
    {
      path: 'audit',
      name: 'DevPlatform-audit',
      component: () => import('@/views/devPlatform/audit'),
      meta: {
        title: '项目审核',
        icon: 'list'
      }
    },
    {
      path: 'message',
      name: 'DevPlatform-message',
      component: () => import('@/views/devPlatform/message'),
      meta: {
        title: '消息列表',
        icon: 'list'
      }
    },
    // {
    //   path: 'projects',
    //   name: 'DevPlatform-projects',
    //   component: () => import('@/views/devPlatform/projects'),
    //   meta: {
    //     title: '项目查询',
    //     icon: 'list'
    //   }
    // }
  ]
}

export default devPlatformRouter