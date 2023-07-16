import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const contantsRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/workbench'
  },
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '', // 当一个二级路由的path为空的时候 当前二级对应的组件component会作为默认渲染组件
      // 访问的是一级路由的路径 在一级路由路径对应的组件内部的二级路由出口 这个path为空的二级路由
      // 一上来就会渲染出来
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },
  {
    path: '/enterpriseAdd',
    component: () => import('@/views/Park/Enterprise/Add.vue')
  },
  {
    path: '/RoleAdd',
    component: () => import('@/views/System/Role/AddRole')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: contantsRoutes
})

const router = createRouter()
console.log(router.getRoutes())

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
