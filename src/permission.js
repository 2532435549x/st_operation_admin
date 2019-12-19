/*
 * @Description: permission
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-16 18:10:54
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

import roleList from '@/router/manage'

const permissionListAllGet = [
  {
    isShow: true,
    moduleName: '系统管理',
    modulePathName: 'System',
    childrenModuleList: [
      {
        isShow: true,
        moduleName: '系统用户管理',
        modulePathName: 'System-user'
      },
      {
        isShow: true,
        moduleName: '系统角色管理',
        modulePathName: 'System-role'
      }
    ]
  },
  {
    isShow: true,
    moduleName: '通用管理',
    modulePathName: 'Dictionary',
    childrenModuleList: [
      {
        isShow: true,
        moduleName: '扩展字段',
        modulePathName: 'Dictionary-data'
      },
      {
        isShow: true,
        moduleName: '通用配置',
        modulePathName: 'Dictionary-manage'
      }
    ]
  }
]
function parseMenu(a, b) {
  // a 是前端路由数组
  // b 是后端返回的路由列表
  function getList(b) {
    let menuList = new Array()
    b.map(i => {
      if (i.isShow) {
        if (i.modulePathName) {
          menuList.push(i)
        }
        if (i.childrenModuleList && i.childrenModuleList.length > 0) {
          const list = getList(i.childrenModuleList)
          menuList = menuList.concat(list)
        }
      }
    })
    return menuList
  }

  function getM(a, b) {
    const menuList = new Array()
    a.map(i => {
      const arr = b.filter(j => j.modulePathName == i.name)
      if (arr.length < 1) {
        return
      }

      const object = Object.assign({}, i)
      if (arr[0].permissionList && arr[0].permissionList.length > 0) {
        object.meta.permissionList = arr[0].permissionList
      }
      if (i.children && i.children.length > 0) {
        const list = getM(i.children, b)
        object.children = list
      }
      menuList.push(object)
    })
    menuList.push({
      path: '*',
      redirect: '/404',
      hidden: true
    })
    return menuList
  }

  const getPermissionsList = getList(b)
  return getM(a, getPermissionsList)
} // 无线循环树形菜单方法

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (!from.meta.isHidden && !to.meta.isHidden) {
    window.sessionStorage.removeItem('xxx-pageNum')
  }

  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      try {
        if (store.getters.addRoutes && store.getters.addRoutes.length === 0) {
          const roles = await store.dispatch('GetInfo')
          // generate accessible routes map based on roles
          const listMenu = parseMenu(roleList, permissionListAllGet)
          // const rolesList = roleList.reduce((result, item) => {
          //   const isHidden = roles.moduleList.some((i) => i.moduleName === item.meta.title && i.isShow)
          //   if (isHidden) {
          //     result.push(item)
          //   }
          //   return result
          // }, [])

          // console.log('roleList: ', roleList)
          const accessRoutes = await store.dispatch('permission/generateRoutes', roleList)
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } else {
          next()
        }
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('resetToken')
        Message.error(error || 'Has Error')
        // `/login?redirect=${to.path}`
        next({
          path: '/login',
          query: Object.assign({}, {
            redirect: to.path
          }, to.query)
        })
        NProgress.done()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({
        path: '/login',
        query: Object.assign({}, {
          redirect: to.path
        }, to.query)
      })
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
