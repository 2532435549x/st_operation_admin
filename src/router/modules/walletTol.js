/*
 * @Description: Routing module @walletTolRouter
 * @Author: wangyun
 * @Date: 2019-08-07 15:16:05
 * @LastEditTime: 2019-11-25 14:47:29
 */
import Layout from '@/layout/Layout'

const walletTolRouter = {
  path: '/walletTol',
  name: ' WalletTol',
  component: Layout,
  redirect: '/walletTol/find',
  meta: {
    title: '钱包管理',
    icon: 'wallet'
  },
  children: [
    // 发现
    {
      path: 'find',
      name: 'WalletTol-find',
      component: () => import('@/views/walletTol/find'),
      redirect: '/walletTol/find/dapp',
      meta: {
        title: '发现管理',
        icon: 'find'
      },
      children: [
        // DApp
        {
          path: 'dapp',
          name: 'WalletTol-find-dapp',
          component: () => import('@/views/walletTol/find/dapp'),
          redirect: '/walletTol/find/dapp/dapp-list',
          meta: {
            title: 'DApp管理'
          },
          children: [
            {
              path: 'dapp-list',
              name: 'WalletTol-find-dapp-list',
              component: () => import('@/views/walletTol/find/dapp/folder/list'),
              meta: {
                title: 'DApp列表'
              }
            },
            {
              path: 'dapp-detail',
              name: 'WalletTol-find-dapp-detail',
              component: () => import('@/views/walletTol/find/dapp/folder/detail'),
              meta: {
                title: 'DApp详情',
                isHidden: true
              },
              hidden: true
            },
            {
              path: 'dapp-edit',
              name: 'WalletTol-find-dapp-edit',
              component: () => import('@/views/walletTol/find/dapp/folder/edit'),
              meta: {
                title: 'DApp编辑',
                isHidden: true
              },
              hidden: true
            },
            {
              path: 'dapp-commentList',
              name: 'WalletTol-find-dapp-commentList',
              component: () => import('@/views/walletTol/find/dapp/folder/commentList'),
              meta: {
                title: 'DApp评论列表'
              }
            }
          ]
        },

        // banner
        {
          path: 'banner',
          name: 'WalletTol-find-banner',
          component: () => import('@/views/walletTol/find/banner'),
          redirect: '/walletTol/find/banner/banner-list',
          meta: {
            title: 'banner'
          },
          children: [
            {
              path: 'banner-list',
              name: 'WalletTol-find-banner-list',
              component: () => import('@/views/walletTol/find/banner/folder/list'),
              meta: {
                title: 'banner管理'
              },
            },
            {
              path: 'banner-add_edit',
              name: 'WalletTol-find-banner-add_edit',
              component: () => import('@/views/walletTol/find/banner/folder/add_edit'),
              meta: {
                title: 'banner添加/编辑',
                isHidden: true
              },
              hidden: true
            }
          ]
        },

        // 精品推荐
        {
          path: 'recommend',
          name: 'WalletTol-find-recommend',
          component: () => import('@/views/walletTol/find/recommend'),
          redirect: '/walletTol/find/recommend/recommend-list',
          meta: {
            title: '精品推荐'
          },
          children: [
            {
              path: 'recommend-list',
              name: 'WalletTol-find-recommend-list',
              component: () => import('@/views/walletTol/find/recommend/folder/list'),
              meta: {
                title: '精品推荐管理'
              },
            },
            {
              path: 'recommend-add_edit',
              name: 'WalletTol-find-recommend-add_edit',
              component: () => import('@/views/walletTol/find/recommend/folder/add_edit'),
              meta: {
                title: '精品推荐添加/编辑',
                isHidden: true
              },
              hidden: true
            }
          ]
        },

        // 分类
        {
          path: 'dappCategory',
          name: 'WalletTol-find-dappCategory',
          component: () => import('@/views/walletTol/find/dappCategory'),
          redirect: '/walletTol/find/dappCategory/dappCategory-list',
          meta: {
            title: '分类',
          },
          children: [
            {
              path: 'dappCategory-list',
              name: 'WalletTol-find-dappCategory-list',
              component: () => import('@/views/walletTol/find/dappCategory/folder/list'),
              meta: {
                title: '分类管理'
              }
            },
            {
              path: 'dappCategory-allocation',
              name: 'WalletTol-find-dappCategory-allocation',
              component: () => import('@/views/walletTol/find/dappCategory/folder/allocation'),
              meta: {
                title: '分类DApp配置',
                isHidden: true
              },
              hidden: true
            }

          ]
        },

        // 合集
        {
          path: 'collection',
          name: 'WalletTol-find-collection',
          component: () => import('@/views/walletTol/find/collection'),
          redirect: '/walletTol/find/collection/collection-list',
          meta: {
            title: '合集',
          },
          children: [
            {
              path: 'collection-list',
              name: 'WalletTol-find-collection-list',
              component: () => import('@/views/walletTol/find/collection/folder/list'),
              meta: {
                title: '合集管理'
              },
            },
            {
              path: 'collection-allocation',
              name: 'WalletTol-find-collection-allocation',
              component: () => import('@/views/walletTol/find/collection/folder/allocation'),
              meta: {
                title: '合集DApp配置',
                isHidden: true
              },
              hidden: true
            }
          ]
        },
      ]
    },

    // 代币
    {
      path: 'coin',
      name: 'WalletTol-coin',
      component: () => import('@/views/walletTol/coin'),
      redirect: '/walletTol/coin/coin-list',
      meta: {
        title: '代币',
        icon: 'coin'
      },
      children: [
        {
          path: 'coin-list',
          name: 'WalletTol-coin-list',
          component: () => import('@/views/walletTol/coin/folder/list'),
          meta: {
            title: '代币管理',
            icon: 'coin'
          }
        },
        {
          path: 'coin-add_edit',
          name: 'WalletTol-coin-add_edit',
          component: () => import('@/views/walletTol/coin/folder/add_edit'),
          meta: {
            title: '代币添加/编辑',
            isHidden: true,
          },
          hidden: true
        },
        {
          path: 'coin-allocation',
          name: 'WalletTol-coin-allocation',
          component: () => import('@/views/walletTol/coin/folder/allocation'),
          meta: {
            title: '代币配置DApp',
            isHidden: true,
          },
          hidden: true
        }
      ]
    },

    // 节点配置
    {
      path: 'node',
      name: 'WalletTol-node',
      component: () => import('@/views/walletTol/node'),
      redirect: '/walletTol/node/node-list',
      meta: {
        title: '节点',
        icon: 'node'
      },
      children: [
        {
          path: 'node-list',
          name: 'WalletTol-node-list',
          component: () => import('@/views/walletTol/node/folder/list'),
          meta: {
            title: '节点管理',
          },
        },
        // {
        //   path: 'banner-add_edit',
        //   name: 'WalletTol-find-banner-add_edit',
        //   component: () => import('@/views/walletTol/find/node/folder/add_edit'),
        //   meta: {
        //     title: '节点添加/编辑',
        //     isHidden: true
        //   },
        //   hidden: true
        // }
      ]
    },

    // 行情
    {
      path: 'market',
      name: 'WalletTol-market',
      component: () => import('@/views/walletTol/market'),
      redirect: '/walletTol/market/marketChain',
      meta: {
        title: '行情管理',
        icon: 'market'
      },
      children: [
        // 行情链
        {
          path: 'marketChain',
          name: 'WalletTol-market-marketChain',
          component: () => import('@/views/walletTol/market/marketChain'),
          redirect: '/walletTol/market/marketChain/marketChain-list',
          meta: {
            title: '行情链'
          },
          children: [
            {
              path: 'marketChain-list',
              name: 'WalletTol-market-marketChain-list',
              component: () => import('@/views/walletTol/market/marketChain/folder/list'),
              meta: {
                title: '行情链列表'
              },
            },
            {
              path: 'marketChain-add_edit',
              name: 'WalletTol-market-marketChain-add_edit',
              component: () => import('@/views/walletTol/market/marketChain/folder/add_edit'),
              meta: {
                title: '行情链添加/编辑',
                isHidden: true
              },
              hidden: true
            }
          ]
        },

        // 行情推荐
        {
          path: 'marketRecommend',
          name: 'WalletTol-market-marketRecommend',
          component: () => import('@/views/walletTol/market/marketRecommend'),
          redirect: '/walletTol/market/marketRecommend/marketRecommend-list',
          meta: {
            title: '行情推荐'
          },
          children: [
            {
              path: 'marketRecommend-list',
              name: 'WalletTol-market-marketRecommend-list',
              component: () => import('@/views/walletTol/market/marketRecommend/folder/list'),
              meta: {
                title: '行情推荐列表'
              },
            },
            {
              path: 'marketRecommend-add_edit',
              name: 'WalletTol-market-marketRecommend-add_edit',
              component: () => import('@/views/walletTol/market/marketRecommend/folder/add_edit'),
              meta: {
                title: '行情推荐添加/编辑',
                isHidden: true
              },
              hidden: true
            }
          ]
        },
      ]
    },

    // 投票管理
    {
      path: 'vote',
      name: 'WalletTol-vote',
      component: () => import('@/views/walletTol/vote'),
      meta: {
        title: '投票管理',
        icon: 'vote'
      },
      children: [
        {
          path: 'nodeVote',
          name: 'WalletTol-vote-nodeVote',
          component: () => import('@/views/walletTol/vote/nodeVote'),
          redirect: '/walletTol/vote/nodeVote/nodeVote-list',
          meta: {
            title: '节点投票管理',
          },
          children: [
            {
              path: 'nodeVote-list',
              name: 'WalletTol-vote-nodeVote-list',
              component: () => import('@/views/walletTol/vote/nodeVote/folder/list'),
              meta: {
                title: '节点投票'
              }
            },
            {
              path: 'nodeVote-add_edit',
              name: 'WalletTol-vote-nodeVote-add_edit',
              component: () => import('@/views/walletTol/vote/nodeVote/folder/add_edit'),
              meta: {
                title: '节点投票添加/编辑',
                isHidden: true
              },
              hidden: true
            }
          ]
        },
        {
          path: 'proxyVote',
          name: 'WalletTol-vote-proxyVote',
          component: () => import('@/views/walletTol/vote/proxyVote'),
          redirect: '/walletTol/vote/proxyVote/proxyVote-list',
          meta: {
            title: '代理投票管理',
          },
          children: [
            {
              path: 'proxyVote-list',
              name: 'WalletTol-vote-proxyVote-list',
              component: () => import('@/views/walletTol/vote/proxyVote/folder/list'),
              meta: {
                title: '代理投票'
              }
            },
            {
              path: 'proxyVote-detail',
              name: 'WalletTol-vote-proxyVote-detail',
              component: () => import('@/views/walletTol/vote/proxyVote/folder/detail'),
              meta: {
                title: '代理投票详情',
                isHidden: true
              },
              hidden: true
            }
          ]
        }
      ]
    },

    // 启动管理
    {
      path: 'launch',
      name: 'WalletTol-launch',
      component: () => import('@/views/walletTol/launch'),
      redirect: '/walletTol/launch/advert',
      meta: {
        title: '启动管理',
        icon: 'launch'
      },
      children: [
        {
          path: 'advert',
          name: 'WalletTol-launch-advert',
          component: () => import('@/views/walletTol/launch/advert'),
          redirect: '/walletTol/launch/advert/advert-list',
          meta: {
            title: '启动页广告',
          },
          children: [
            {
              path: 'advert-list',
              name: 'WalletTol-launch-advert-list',
              component: () => import('@/views/walletTol/launch/advert/folder/list'),
              meta: {
                title: '启动页广告管理'
              },
            },
            {
              path: 'advert-add_edit',
              name: 'WalletTol-launch-advert-add_edit',
              component: () => import('@/views/walletTol/launch/advert/folder/add_edit'),
              meta: {
                title: '启动页广告添加/编辑',
                isHidden: true
              },
              hidden: true
            }
          ]
        }
      ]
    },

    // 公告管理
    {
      path: 'notify',
      name: 'WalletTol-notify',
      component: () => import('@/views/walletTol/notify'),
      redirect: '/walletTol/notify/notify-list',
      meta: {
        title: '公告',
        icon: 'notify'
      },
      children: [
        {
          path: 'notify-list',
          name: 'WalletTol-notify-list',
          component: () => import('@/views/walletTol/notify/folder/list'),
          meta: {
            title: '公告管理',
            icon: 'notify'
          }
        },
        {
          path: 'notify-add_edit',
          name: 'WalletTol-notify-add_edit',
          component: () => import('@/views/walletTol/notify/folder/add_edit'),
          meta: {
            title: '公告添加/编辑',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    // 云备份管理
    {
      path: 'cloudBackup',
      name: 'WalletTol-cloudBackup',
      component: () => import('@/views/walletTol/cloud'),
      redirect: '/walletTol/cloudBackup/cloudBackup-listTol',
      meta: {
        title: '云备份管理',
        icon: 'cloud'
      },
      // alwaysShow: true,
      children: [
        {
          path: 'cloudBackup-listTol',
          name: 'WalletTol-cloudBackup-listTol',
          component: () => import('@/views/walletTol/cloud/folder/listTol'),
          meta: {
            title: '云备份总览'
          }
        },
        {
          path: 'cloudBackup-listAccount',
          name: 'WalletTol-cloudBackup-listAccount',
          component: () => import('@/views/walletTol/cloud/folder/listAccount'),
          meta: {
            title: '链备份列表',
            isHidden: true
          },
          hidden: true
        },
        {
          path: 'cloudBackup-listChain',
          name: 'WalletTol-cloudBackup-listChain',
          component: () => import('@/views/walletTol/cloud/folder/listChain'),
          meta: {
            title: '异链账户列表',
          },
          hidden: true
        },
        {
          path: 'cloudBackup-listAccountDetail',
          name: 'WalletTol-cloudBackup-listAccountDetail',
          component: () => import('@/views/walletTol/cloud/folder/listAccountDetail'),
          meta: {
            title: '账户备份详情',
          },
          hidden: true
        },
      ]
    },

    // 反馈管理
    {
      path: 'feedBack',
      name: 'WalletTol-feedBack',
      component: () => import('@/views/walletTol/feedBack'),
      meta: {
        title: '反馈管理',
        icon: 'manage'
      },
      children: [
        {
          path: 'feedBack-list',
          name: 'WalletTol-feedBack-list',
          component: () => import('@/views/walletTol/feedBack/folder/list'),
          meta: {
            title: '反馈列表'
          }
        },
        {
          path: 'feedBack-typeList',
          name: 'WalletTol-feedBack-typeList',
          component: () => import('@/views/walletTol/feedBack/folder/typeList'),
          meta: {
            title: '反馈类型列表'
          }
        },
      ]
    },

    // 链错误信息管理
    {
      path: 'chainError',
      name: 'WalletTol-chainError',
      component: () => import('@/views/walletTol/chainError'),
      redirect: '/walletTol/chainError/chainError-list',
      meta: {
        title: '链错误信息',
        icon: 'error'
      },
      children: [
        {
          path: 'chainError-list',
          name: 'WalletTol-chainError-list',
          component: () => import('@/views/walletTol/chainError/folder/list'),
          meta: {
            title: '链错误信息管理',
          },
        },
      ]
    },

    // 链管理
    {
      path: 'chain',
      name: 'WalletTol-chain',
      component: () => import('@/views/walletTol/chain'),
      redirect: '/walletTol/chain/chain-list',
      meta: {
        title: '链',
        icon: 'chain'
      },
      children: [
        {
          path: 'chain-list',
          name: 'WalletTol-chain-list',
          component: () => import('@/views/walletTol/chain/folder/list'),
          meta: {
            title: '链管理',
          },
        },
        {
          path: 'chain-add_edit',
          name: 'WalletTol-chain-add_edit',
          component: () => import('@/views/walletTol/chain/folder/add_edit'),
          meta: {
            title: '链添加/编辑',
            isHidden:true
          },
          hidden: true
        },
      ]
    },
  ]
}

export default walletTolRouter