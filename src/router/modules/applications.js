/*
 * @Description: Routing module @applicationsRouter
 * @Author: wangyun
 * @Date: 2019-08-07 15:16:05
 * @LastEditTime: 2019-12-13 09:57:29
 */

import Layout from '@/layout/Layout'

const applicationsRouter = {
  path: '/applications',
  name: 'Applications',
  component: Layout,
  redirect: '/applications/mining/mining-list',
  meta: {
    title: '产品应用',
    icon: 'applications'
  },
  children: [
    // mining module 挖矿模块
    {
      path: 'mining',
      name: 'Applications-mining',
      component: () => import('@/views/applications/mining'),
      meta: {
        title: 'EOS挖矿',
        icon: 'mining'
      },
      children: [
        {
          path: 'mining-list',
          name: 'Applications-mining-list',
          component: () => import('@/views/applications/mining/miningList'),
          meta: {
            title: '挖矿列表',
            icon: 'list'
          }
        }
        // {
        //   path: 'mining-echarts',
        //   name: 'Applications-mining-echarts',
        //   component: () => import('@/views/applications/mining/miningEcharts'),
        //   meta: {
        //     title: '挖矿图表',
        //     icon: 'echarts'
        //   }
        // }
      ]
    },

    // grapefruit module 柚子街模块
    {
      path: 'grapefruit',
      name: 'Grapefruit',
      component: () => import('@/views/applications/grapefruit'),
      meta: {
        title: '柚子街',
        icon: 'shopping'
      },
      redirect: '/applications/grapefruit/grapefruit-list',
      children: [
        {
          path: 'grapefruit-news',
          name: 'Grapefruit-news',
          component: () => import('@/views/applications/grapefruit/grapefruitnews'),
          meta: {
            title: '柚子街消息',
            icon: 'list'
          }
        },
        {
          path: 'grapefruit-list',
          name: 'Grapefruit-list',
          component: () => import('@/views/applications/grapefruit/grapefruitList'),
          meta: {
            title: '订单列表',
            icon: 'list'
          }
        },
        {
          path: 'grapefruit-shops',
          name: 'Grapefruit-shops',
          component: () => import('@/views/applications/grapefruit/grapefruitShop'),
          meta: {
            title: '柚子街商品',
            icon: 'list'
          }
        },
        {
          path: 'grapefruit-setting',
          name: 'Grapefruit-setting',
          component: () => import('@/views/applications/grapefruit/grapefruitSetting'),
          meta: {
            title: '配置管理',
            icon: 'list'
          }
        },
        {
          path: 'grapefruit-add-edit',
          name: 'Grapefruit-add-edit',
          component: () => import('@/views/applications/grapefruit/grapefruitShop/add'),
          meta: {
            title: '添加商品',
            icon: 'list'
          },
          hidden: true
        },
        {
          path: 'grapefruit-brand',
          name: 'Grapefruit-brand',
          component: () => import('@/views/applications/grapefruit/grapefruitBrand'),
          meta: {
            title: '品牌列表',
            icon: 'list'
          }
        },
        {
          path: 'grapefruit-brand-add-edit',
          name: 'Grapefruit-brand-add-edit',
          component: () => import('@/views/applications/grapefruit/grapefruitBrand/add'),
          meta: {
            title: '编辑',
            icon: 'list'
          },
          hidden: true
        },
        {
          path: 'grapefruit-grapefruitCategory',
          name: 'Grapefruit-grapefruitCategory',
          component: () => import('@/views/applications/grapefruit/grapefruitCategory'),
          meta: {
            title: '分类列表',
            icon: 'list'
          }
        }, {
          path: 'grapefruit-grapefruitCategory-add-edit',
          name: 'Grapefruit-grapefruitCategory-add-edit',
          component: () => import('@/views/applications/grapefruit/grapefruitCategory/add'),
          meta: {
            title: '编辑',
            icon: 'logs'
          },
          hidden: true
        },
        {
          path: 'grapefruit-detail',
          name: 'Grapefruit-detail',
          component: () => import('@/views/applications/grapefruit/grapefruitList/orderDetail'),
          meta: {
            title: '订单详情',
            icon: 'list'
          },
          hidden: true
        }, {
          path: 'grapefruit-address',
          name: 'Grapefruit-address',
          component: () => import('@/views/applications/grapefruit/address'),
          meta: {
            title: '地址管理',
            icon: 'manage'
          }
        }, {
          path: 'grapefruit-logs',
          name: 'Grapefruit-logs',
          component: () => import('@/views/applications/grapefruit/logs'),
          meta: {
            title: '柚子街日志',
            icon: 'list'
          }
        },
        {
          path: 'grapefruit-Courier',
          name: 'Grapefruit-Courier',
          component: () => import('@/views/applications/grapefruit/Courier'),
          meta: {
            title: '快递公司',
            icon: 'list'
          }
        },

        {
          path: 'grapefruit-banner',
          name: 'Grapefruit-banner',
          component: () => import('@/views/applications/grapefruit/grapefruitBanner'),
          meta: {
            title: 'Banner管理',
            icon: 'manage'
          }
        }, {
          path: 'grapefruit-branner-add-edit',
          name: 'grapefruit-branner-add-edit',
          component: () => import('@/views/applications/grapefruit/grapefruitBanner/add'),
          meta: {
            title: 'banner详情',
            icon: 'echarts'
          },
          hidden: true
        }

      ]
    },
    // eidos矿机 module
    {
      path: 'eidos',
      name: 'eidos',
      component: () => import('@/views/applications/eidos'),
      meta: {
        title: 'EIDOS 算力共享',
        icon: 'shopping'
      },
      redirect: '/applications/eidos/eidos-list',
      children: [
        {
          path: 'eidos-list',
          name: 'eidos-list',
          component: () => import('@/views/applications/eidos/eidosList'),
          meta: {
            title: '矿机列表',
            icon: 'list'
          }
        },
        {
          path: 'subscription-list',
          name: 'subscription-list',
          component: () => import('@/views/applications/eidos/subscriptionList'),
          meta: {
            title: '认购管理',
            icon: 'list'
          }
        },
        {
          path: 'transfer-list',
          name: 'transfer-list',
          component: () => import('@/views/applications/eidos/transfer'),
          meta: {
            title: '转账记录',
            icon: 'list'
          }
        },

        {
          path: 'earnings-list',
          name: 'earnings-list',
          component: () => import('@/views/applications/eidos/earningsList'),
          meta: {
            title: '收益管理',
            icon: 'list'
          }
        },
        {
          path: 'product',
          name: 'product',
          component: () => import('@/views/applications/eidos'),
          redirect: '/applications/eidos/product/list',
          meta: {
            title: '产品',
            icon: 'list'
          },
          children: [
            {
              path: 'list',
              name: 'productList',
              component: () => import('@/views/applications/eidos/productList'),
              meta: {
                title: '产品列表',
                icon: 'list'
              }
            },
            {
              path: 'detail',
              name: 'productDetail',
              component: () => import('@/views/applications/eidos/productList/detailProduct'),
              meta: {
                title: '产品详情',
                icon: 'list'

              },
              hidden: true
            }]
        }
      ]
    },
    {
      path: 'mindking',
      name: 'Applications-mindking',
      component: () => import('@/views/applications/mindking'),
      meta: {
        title: '头脑王者',
        icon: 'mining'
      },
      children: [
        {
          path: 'game-list',
          name: 'Applications-game-list',
          component: () => import('@/views/applications/mindking/gameList'),
          meta: {
            title: '游戏列表',
            icon: 'list'
          }
        },
        {
          path: 'game-list-add-edit',
          name: 'mindking-game-list-add-edit',
          component: () => import('@/views/applications/mindking/gameList/edit'),
          meta: {
            title: '编辑',
            icon: 'logs'
          },
          hidden: true
        },
        {
          path: 'question-bank',
          name: 'Applications-question-bank',
          component: () => import('@/views/applications/mindking/questionBank'),
          meta: {
            title: '题库管理',
            icon: 'echarts'
          }
        },
        {
          path: 'question-bank-add-edit',
          name: 'mindking-question-bank-add-edit',
          component: () => import('@/views/applications/mindking/questionBank/edit'),
          meta: {
            title: '编辑',
            icon: 'logs'
          },
          hidden: true
        }
      ]
    },
    {
      path: 'turntable',
      name: 'Applications-turntable',
      component: () => import('@/views/applications/turntable'),
      meta: {
        title: '幸运大转盘',
        icon: 'mining'
      },
      children: [
        {
          path: 'game-edit',
          name: 'Applications-game-edit',
          component: () => import('@/views/applications/turntable/game/edit'),
          meta: {
            title: '主体配置',
            icon: 'echarts'
          }
        },
        {
          path: 'search',
          name: 'Applications-search',
          component: () => import('@/views/applications/turntable/search'),
          meta: {
            title: '查询管理',
            icon: 'echarts'
          }
        },
        {
          path: 'prize',
          name: 'Applications-prize',
          component: () => import('@/views/applications/turntable/prize'),
          meta: {
            title: '奖品管理',
            icon: 'echarts'
          }
        },
        {
          path: 'prize-add-edit',
          name: 'turntable-prize-add-edit',
          component: () => import('@/views/applications/turntable/prize/edit'),
          meta: {
            title: '编辑',
            icon: 'logs'
          },
          hidden: true
        },
        {
          path: 'contract',
          name: 'Applications-contract',
          component: () => import('@/views/applications/turntable/contract'),
          meta: {
            title: '合约配置',
            icon: 'echarts'
          }
        },
        {
          path: 'contract-edit',
          name: 'Applications-contract-edit',
          component: () => import('@/views/applications/turntable/contract/edit'),
          meta: {
            title: '合约编辑',
            icon: 'echarts'
          },
          hidden: true
        }
      ]
    }

  ]
}

export default applicationsRouter
