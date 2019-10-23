import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /api/admin/user/list'],
          title: '会员管理',
          noCache: true
        }
      },
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /api/admin/address/list'],
          title: '收货地址',
          noCache: true
        }
      }

    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'prizeManage',
    meta: {
      title: '抽奖管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'prize',
        component: () => import('@/views/prize'),
        name: 'prize',
        meta: {
          perms: ['GET /api/admin/prize/list', 'POST /api/admin/prize/add'],
          title: '抽奖列表',
          noCache: true
        }
      },
      {
        path: 'prize/add',
        component: () => import('@/views/prize/add'),
        name: 'prizeAdd',
        hidden: true,
        meta: {
          perms: ['GET /api/admin/prize/list', 'POST /api/admin/prize/add'],
          title: '新增',
          noCache: true
        }
      },
      {
        path: 'prize/edit',
        component: () => import('@/views/prize/add'),
        name: 'prizeEdit',
        hidden: true,
        meta: {
          perms: ['GET /api/admin/prize/list', 'POST /api/admin/prize/add'],
          title: '修改',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /api/admin/admin/list', 'POST /api/admin/admin/create', 'POST /api/admin/admin/update', 'POST /api/admin/admin/delete'],
          title: '管理员',
          noCache: true
        }
      },
      {
        path: 'log',
        component: () => import('@/views/sys/log'),
        name: 'log',
        meta: {
          perms: ['GET /api/admin/log/list'],
          title: '操作日志',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /api/admin/role/list', 'POST /api/admin/role/create', 'POST /api/admin/role/update', 'POST /api/admin/role/delete', 'GET /api/admin/role/permissions', 'POST /api/admin/role/permissions'],
          title: '角色管理',
          noCache: true
        }
      }

    ]
  },
  {
    path: '/stat',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'statManage',
    meta: {
      title: '打卡管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'clockinuser',
        component: () => import('@/views/clockin/user'),
        name: 'clockinuser',
        meta: {
          perms: ['GET /api/admin/clockin/user/list'],
          title: '用户列表',
          noCache: true
        }
      },
      {
        path: 'clockuserinfo',
        component: () => import('@/views/clockin/index'),
        name: 'clockuserinfo',
        meta: {
          perms: ['GET /api/admin/clockin/user/info'],
          title: '用户统计',
          noCache: true
        }
      }

    ]
  },

  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]
