/*
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-11-22 15:59:42
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-25 15:31:14
 */
import Layout from '@/layout/Layout'

const casRouter = {
  path: '/cas',
  name: 'Cas',
  component: Layout,
  redirect: '/cas/application',
  meta: {
    title: 'Cas管理',
    icon: 'cas'
  },
  children: [
    {
      path: 'application',
      name: 'Cas-application',
      component: () => import('@/views/cas/application'),
      redirect: '/cas/application/application-list',
      meta: {
        title: '应用管理'
      },
      children: [
        {
          path: 'application-list',
          name: 'cas-application-list',
          component: () => import('@/views/cas/application/folder/list'),
          meta: {
            title: '应用列表',
            icon: 'list'
          }
        },
        {
          path: 'application-add_edit',
          name: 'cas-application-add_edit',
          component: () => import('@/views/cas/application/folder/add_edit'),
          meta: {
            title: '应用添加/编辑',
            isHidden: true
          },
          hidden: true
        }
      ]
    },

    {
      path: 'authcode',
      name: 'Cas-authcode',
      component: () => import('@/views/cas/authcode'),
      redirect: '/cas/authcode/authcode-list',
      meta: {
        title: '授权管理'
      },
      children: [
        {
          path: 'authcode-list',
          name: 'cas-authcode-list',
          component: () => import('@/views/cas/authcode/folder/list'),
          meta: {
            title: '授权码发送记录',
            icon: 'list'
          }
        }
      ]
    },

    {
      path: 'casuser',
      name: 'Cas-casuser',
      component: () => import('@/views/cas/casuser'),
      meta: {
        title: '用户列表',
        icon: 'list'
      },
    },

    {
      path: 'casrecord',
      name: 'Cas-casrecord',
      component: () => import('@/views/cas/casrecord'),
      meta: {
        title: '积分列表',
        icon: 'list'
      },
    },
    {
      path: 'loghistory',
      name: 'Cas-loghistory',
      component: () => import('@/views/cas/loghistory'),
      meta: {
        title: '登录历史',
        icon: 'list'
      },
    },
    {
      path: 'kyc',
      name: 'kyc',
      component: () => import('@/views/cas/kyc'),
      meta: {
        title: 'KYC',
        icon: 'idCard'
      },
      redirect: '/cas/kyc/country-list',
      children: [
        {
          path: 'country-list',
          name: 'country-list',
          component: () => import('@/views/cas/kyc/countrylist'),
          meta: {
            title: '国家列表',
            icon: 'country'
          }
        },
        {
          path: 'user-list',
          name: 'user-list',
          component: () => import('@/views/cas/kyc/userlist/folder'),
          meta: {
            title: '用户kyc申请列表',
            icon: 'user_kyc'
          },
        },
        {
          path: 'listdetail',
          name: 'listdetail',
          component: () => import('@/views/cas/kyc/userlist/folder/listdetail'),
          meta: {
            title: '用户kyc申请详情',
            icon: 'user_kyc'
          },
          hidden: true
        },
        {
          path: 'kycsetting',
          name: 'kycsetting',
          component: () => import('@/views/cas/kyc/kycsetting'),
          meta: {
            title: '审核配置管理',
            icon: 'review'
          },
        },
        {
          path: 'recording',
          name: 'recording',
          component: () => import('@/views/cas/kyc/recording'),
          meta: {
            title: '用户kyc操作记录',
            icon: 'kyclog'
          },
        },
      ]
    }
  ]
}

export default casRouter