/*
 * @Description: router -> manage
 * @Author: wangyun
 * @Date: 2019-08-7 10:03:18
 * @LastEditTime: 2019-11-14 09:33:12
 */

/* Layout */
import Layout from '@/layout/Layout'

const modulesFiles = require.context('./modules', false, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])

const routerAddModules =
  [
    // 系统管理
    {
      path: '/system',
      component: Layout,
      redirect: '/system/system-user',
      name: 'System',
      meta: {
        title: '系统管理',
        icon: 'lock'
      },
      children: [{
        path: 'system-user',
        name: 'System-user',
        component: () => import('@/views/user/systemuser'),
        meta: {
          title: '系统用户管理',
          icon: 'nested'
        }
      },
      {
        path: 'system-role',
        name: 'System-role',
        component: () => import('@/views/user/userMange'),
        meta: {
          title: '系统角色管理',
          icon: 'tree'
        }
      }
      ]
    },

    // 通用管理
    {
      path: '/dictionary',
      component: Layout,
      redirect: '/dictionary/dictionary-data',
      name: 'Dictionary',
      meta: {
        title: '通用管理',
        icon: 'settings'
      },
      children: [{
        path: 'dictionary-data',
        name: 'Dictionary-data',
        component: () =>
          import('@/views/dictionary/dictionaryData'),
        meta: {
          title: '扩展字段',
          icon: 'list'
        }
      },
      {
        path: 'dictionary-manage',
        name: 'Dictionary-manage',
        component: () =>
          import('@/views/dictionary/dictionaryManage'),
        meta: {
          title: '通用配置',
          icon: 'manage'
        }
      }
      ]
    }

    /** when your routing map is too long, you can split it into small modules **/
    
    // {
    //   path: '/RemarkRecordModule',
    //   component: Layout,
    //   redirect: '/RemarkRecordModule/RemarkRecordModule',
    //   name: 'RemarkRecordModule',
    //   meta: {
    //     title: '数据备注模块',
    //     icon: 'form'
    //   },
    //   children: [{
    //     path: 'RemarkRecordModuleList',
    //     name: 'RemarkRecordModuleList',
    //     component: () =>
    //       import('@/views/RemarkRecordModule/RemarkRecordModule'),
    //     meta: {
    //       title: '数据备注模块',
    //       icon: 'tree'
    //     }
    //   }]
    // },

    // {
    //   path: '/find',
    //   component: Layout,
    //   redirect: '/find/dappCate',
    //   name: 'find',
    //   meta: {
    //     title: '推文管理',
    //     icon: 'example'
    //   },
    //   children: [{
    //     path: 'articleList',
    //     name: 'articleList',
    //     component: () =>
    //       import('@/views/find/articleList'),
    //     meta: {
    //       title: '发现首页管理',
    //       icon: 'tree'
    //     }
    //   },
    //   {
    //     path: 'addArticle',
    //     name: 'addArticle',
    //     component: () =>
    //       import('@/views/find/addArticle'),
    //     meta: {
    //       title: '新增推文',
    //       icon: 'tree'
    //     },
    //     hidden: true
    //   },
    //   {
    //     path: 'articleDetail',
    //     name: 'articleDetail',
    //     component: () =>
    //       import('@/views/find/articleDetail'),
    //     meta: {
    //       title: '查看详情',
    //       icon: 'tree'
    //     },
    //     hidden: true
    //   }
    //   ]
    // },

    // {
    //   path: '/keywords',
    //   component: Layout,
    //   redirect: '/keywords/keywordsList',
    //   name: 'keywords',
    //   meta: {
    //     title: '热门搜索词模块',
    //     icon: 'eos'
    //   },
    //   children: [{
    //     path: 'keywordsList',
    //     name: 'keywordsList',
    //     component: () =>
    //       import('@/views/find/keywords'),
    //     meta: {
    //       title: '搜索关键词',
    //       icon: 'nested'
    //     }
    //   }]
    // },

  ]
const moduleRouteAdd = routerAddModules.concat(modules)
export default moduleRouteAdd
