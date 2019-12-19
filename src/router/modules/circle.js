/*
 * @Description: Routing module @circleRouter
 * @Author: wangyun
 * @Date: 2019-08-07 15:16:05
 * @LastEditTime: 2019-11-23 18:18:33
 */
import Layout from '@/layout/Layout'

const circleRouter = {
  path: '/circle',
  name: 'Circle',
  component: Layout,
  redirect: '/circle/news',
  meta: {
    title: '圈子管理',
    icon: 'circle'
  },
  children: [
    {
      path: 'bannertop',
      name: 'Circle-bannertop',
      component: () => import('@/views/circle/bannertop'),
      redirect: '/circle/bannertop/bannertop-list',
      meta: {
        title: '首页banner管理',
        icon: 'banner'
      },
      children: [
        {
          path: 'bannertop-list',
          name: 'Circle-bannertop-list',
          component: () => import('@/views/circle/bannertop/folder/list'),
          meta: {
            title: '首页banner'
          }
        },
        {
          path: 'bannertop-add_edit',
          name: 'Circle-bannertop-add_edit',
          component: () => import('@/views/circle/bannertop/folder/add_edit'),
          meta: {
            title: '首页banner添加/编辑',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    {
      path: 'news',
      name: 'Circle-news',
      component: () => import('@/views/circle/news'),
      meta: {
        title: '最新消息',
        icon: 'news'
      }
    },

    {
      path: 'postdetail',
      name: 'Circle-postdetail',
      component: () => import('@/views/circle/postdetail'),
      meta: {
        title: '帖子详情',
        icon: 'list',
        isHidden: true
      },
      hidden: true
    },

    {
      path: 'poster',
      name: 'Circle-poster',
      component: () => import('@/views/circle/poster'),
      meta: {
        title: '帖子管理',
        icon: 'post'
      }
    },

    {
      path: 'comment',
      name: 'Circle-comment',
      component: () => import('@/views/circle/comment'),
      meta: {
        title: '评论管理',
        icon: 'comment'
      }
    },

    {
      path: 'integralAdmin',
      name: 'Circle-integralAdmin',
      component: () => import('@/views/circle/integralAdmin'),
      meta: {
        title: '积分管理',
        icon: 'integral'
      }
    },

    {
      path: 'integralConf',
      name: 'Circle-integralConf',
      component: () => import('@/views/circle/integralConf'),
      redirect: '/circle/integralConf/integralConf-list',
      meta: {
        title: '积分',
        icon: 'config'
      },
      children: [
        {
          path: 'integralConf-list',
          name: 'Circle-integralConf-list',
          component: () => import('@/views/circle/integralConf/folder/list'),
          meta: {
            title: '积分配置'
          }
        },
        {
          path: 'integralConf-add_edit',
          name: 'Circle-integralConf-add_edit',
          component: () => import('@/views/circle/integralConf/folder/add_edit'),
          meta: {
            title: '积分配置添加/编辑',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    {
      path: 'users',
      name: 'Circle-users',
      component: () => import('@/views/circle/users'),
      redirect: '/circle/users/users-list',
      meta: {
        title: '用户',
        icon: 'user_m'
      },
      children: [
        {
          path: 'users-list',
          name: 'Circle-users-list',
          component: () => import('@/views/circle/users/folder/list'),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: 'users-detail',
          name: 'Circle-users-detail',
          component: () => import('@/views/circle/users/folder/detail'),
          meta: {
            title: '用户详情',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    {
      path: 'userLabel',
      name: 'Circle-userLabel',
      component: () => import('@/views/circle/userLabel'),
      redirect: '/circle/userLabel/userLabel-list',
      meta: {
        title: '用户标签管理',
        icon: 'label'
      },
      children: [
        {
          path: 'userLabel-list',
          name: 'Circle-userLabel-list',
          component: () => import('@/views/circle/userLabel/folder/list'),
          meta: {
            title: '用户标签'
          }
        },
        {
          path: 'userLabel-add_edit',
          name: 'Circle-userLabel-add_edit',
          component: () => import('@/views/circle/userLabel/folder/add_edit'),
          meta: {
            title: '用户标签添加/编辑',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    {
      path: 'report',
      name: 'Circle-report',
      component: () => import('@/views/circle/report'),
      meta: {
        title: '投诉举报管理',
        icon: 'report'
      }
    },

    {
      path: 'blacklist',
      name: 'Circle-blacklist',
      component: () => import('@/views/circle/blacklist'),
      meta: {
        title: '小黑屋',
        icon: 'blackhome'
      }
    },

    // 打卡签到
    {
      path: 'punch',
      name: 'Circle-punch',
      component: () => import('@/views/circle/punch'),
      redirect: '/circle/punch/punch-listset',
      meta: {
        title: '打卡签到管理',
        icon: 'punch'
      },
      children: [
        {
          path: 'punch-list',
          name: 'Circle-punch-list',
          component: () => import('@/views/circle/punch/folder/list'),
          meta: {
            title: '打卡签到'
          }
        },
        {
          path: 'punch-listset',
          name: 'Circle-punch-listset',
          component: () => import('@/views/circle/punch/folder/listset'),
          meta: {
            title: '打卡签到配置'
          }
        },
        {
          path: 'punch-add_edit',
          name: 'Circle-punch-add_edit',
          component: () => import('@/views/circle/punch/folder/add_edit'),
          meta: {
            title: '打卡签到添加/编辑',
            isHidden: true
          },
          hidden: true
        }
      ]
    },
  ]
}

export default circleRouter
