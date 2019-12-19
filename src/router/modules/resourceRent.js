/*
 * @Description: Routing module @resourceRentRouter
 * @Author: wangyun
 * @Date: 2019-11-07 09:37:24
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-08 16:46:14
 */
import Layout from '@/layout/Layout'

const resourceRentRouter = {
  path: '/resourceRent',
  name: ' ResourceRent',
  component: Layout,
  redirect: '/resourceRent/group',
  meta: {
    title: '资源租赁管理',
    icon: 'resource'
  },
  children: [
    // 资源组
    {
      path: 'group',
      name: 'ResourceRent-group',
      component: () => import('@/views/resourceRent/group'),
      redirect: '/resourceRent/group/group-list',
      meta: {
        title: '资源组管理',
        icon: 'manage'
      },
      children: [
        {
          path: 'group-list',
          name: 'ResourceRent-group-list',
          component: () => import('@/views/resourceRent/group/folder/list'),
          meta: {
            title: '资源组'
          }
        },
        {
          path: 'group-add_edit',
          name: 'ResourceRent-group-add_edit',
          component: () => import('@/views/resourceRent/group/folder/add_edit'),
          meta: {
            title: '资源组添加/修改',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    // 资源项
    {
      path: 'items',
      name: 'ResourceRent-items',
      component: () => import('@/views/resourceRent/items'),
      redirect: '/resourceRent/items/items-list',
      meta: {
        title: '资源项管理',
        icon: 'manage'
      },
      children: [
        {
          path: 'items-list',
          name: 'ResourceRent-items-list',
          component: () => import('@/views/resourceRent/items/folder/list'),
          meta: {
            title: '资源项'
          }
        },
        {
          path: 'items-add_edit',
          name: 'ResourceRent-items-add_edit',
          component: () => import('@/views/resourceRent/items/folder/add_edit'),
          meta: {
            title: '资源项添加/修改',
            isHidden: true
          },
          hidden: true
        }
      ]
    },


    // 资源租赁订单
    {
      path: 'resRent',
      name: 'ResourceRent-resRent',
      component: () => import('@/views/resourceRent/order/resRent'),
      meta: {
        title: '资源租赁订单管理'
      },
      children: [
        {
          path: 'resRent-list',
          name: 'ResourceRent-resRent-list',
          component: () => import('@/views/resourceRent/order/resRent/folder/list'),
          meta: {
            title: '资源租赁订单',
            icon: 'order'
          }
        },
        {
          path: 'resRent-detail',
          name: 'ResourceRent-resRent-detail',
          component: () => import('@/views/resourceRent/order/resRent/folder/detail'),
          meta: {
            title: '资源租赁订单详情',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    // 账号注册订单
    {
      path: 'regAccount',
      name: 'ResourceRent-regAccount',
      component: () => import('@/views/resourceRent/order/regAccount'),
      meta: {
        title: '账号注册订单管理'
      },
      children: [
        {
          path: 'regAccount-list',
          name: 'ResourceRent-regAccount-list',
          component: () => import('@/views/resourceRent/order/regAccount/folder/list'),
          meta: {
            title: '账号注册订单',
            icon: 'order'
          }
        },
        {
          path: 'regAccount-detail',
          name: 'ResourceRent-regAccount-detail',
          component: () => import('@/views/resourceRent/order/regAccount/folder/detail'),
          meta: {
            title: '账号注册订单详情',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    // 账号邀请码订单
    {
      path: 'codeAccount',
      name: 'ResourceRent-codeAccount',
      component: () => import('@/views/resourceRent/order/codeAccount'),
      meta: {
        title: '账号注册邀请码订单管理'
      },
      children: [
        {
          path: 'codeAccount-list',
          name: 'ResourceRent-codeAccount-list',
          component: () => import('@/views/resourceRent/order/codeAccount/folder/list'),
          meta: {
            title: '账号注册邀请码订单',
            icon: 'order'
          }
        },
        {
          path: 'codeAccount-detail',
          name: 'ResourceRent-codeAccount-detail',
          component: () => import('@/views/resourceRent/order/codeAccount/folder/detail'),
          meta: {
            title: '账号注册邀请码订单详情',
            isHidden: true
          },
          hidden: true
        }
      ]
    }
  ]
}

export default resourceRentRouter