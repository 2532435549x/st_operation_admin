/*
 * @Description: Routing module @walletUpdateRouter
 * @Author: wangyun
 * @Date: 2019-08-07 15:16:05
 * @LastEditTime: 2019-09-12 17:26:27
 */

import Layout from '@/layout/Layout'

const walletUpdateRouter = {
  path: '/walletUpdate',
  name: 'WalletUpdate',
  component: Layout,
  redirect: '/walletUpdate/walletUpdate-list',
  meta: {
    title: '钱包更新',
    icon: 'update'
  },
  children: [
    {
      path: 'walletUpdate-list',
      name: 'WalletUpdate-list',
      component: () => import('@/views/walletUpdate/list'),
      meta: {
        title: '钱包更新管理'
      }
    },
    {
      path: 'walletUpdate-add_edit',
      name: 'WalletUpdate-add_edit',
      component: () => import('@/views/walletUpdate/add_edit'),
      meta: {
        title: '钱包版本添加/修改',
        isHidden: true
      },
      hidden: true
    },
    {
      path: 'walletUpdate-detail',
      name: 'WalletUpdate-detail',
      component: () => import('@/views/walletUpdate/detail'),
      meta: {
        title: '钱包版本详情',
        isHidden: true
      },
      hidden: true
    }
  ]
}

export default walletUpdateRouter