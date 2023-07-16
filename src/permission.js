// 放置所有和权限控制相关的代码
// 组件里：this.$router  js文件：import router
// 在普通的js文件中，获取不到组件的上下文（实例对象）
import router from './router'
import { getToken } from './utils/auth'
import store from './store'
import { asyncRoutes } from '@/router/asyncRoutes'
console.log('所有的动态路由', asyncRoutes)
const WHITE_LIST = ['/login', '/404']

// 过滤动态路由
/**
 *
 * @param {*} asyncRoutes  未经过处理的动态路由表
 * @param {*} firstPerms  一级路由权限标识
 * @param {*} secondPerms 二级路由权限标识
 */
function filterRoutes(asyncRoutes, firstPerms, secondPerms) {
  // 增加一个管理员的单独处理逻辑：如果是管理员的权限点 ['*:*:*'] 把所有的动态路由整体返回
  if (firstPerms.includes('*')) {
    return asyncRoutes
  }
  // 3.1 一级路由过滤处理
  const filterRoute = asyncRoutes.filter(route => {
    return firstPerms.includes(route.permission)
  })
  console.log(filterRoute)
  // 3.2 二级路由过滤处理
  const filterFinishedRoutes = filterRoute.map(route => {
    return {
      ...route,
      children: route.children.filter(item => secondPerms.includes(item.permission))
    }
  })
  return filterFinishedRoutes
}

// 获取一级权限点数组
function getFirstPerms(perms) {
  const list = perms.map(item => {
    const _arr = item.split(':')
    return _arr[0]
  })
  // Set是一个js里面的数据结构 不容许出现重复的项
  return [...new Set(list)]
}
// 获取二级权限点数组
function getSecondPerms(perms) {
  const list = perms.map(item => {
    const _arr = item.split(':')
    return `${_arr[0]}:${_arr[1]}`
  })
  // Set是一个js里面的数据结构 不容许出现重复的项
  return [...new Set(list)]
}
router.beforeEach(async(to, from, next) => {
  // to: 去哪里
  // from：从哪里来
  // next: 放行函数
  const token = getToken()
  if (token) {
    // 有.
    next()
    // 在这里触发获取权限数据的action函数
    const perms = await store.dispatch('user/asyncGetUserInfo')
    // 2. 处理成规范的一级和二级菜单标识数组
    console.log('权限数据', perms)
    // 2.1 处理一级菜单权限数据 把第一个冒号前面的字段都放到一个数组中 然后去重
    const firstPerms = getFirstPerms(perms)
    console.log(firstPerms)
    const secondPerms = getSecondPerms(perms)
    console.log(secondPerms)
    // 3. 以权限数据标识数组为判断依据 对动态路由表做过滤处理
    const filterFinishedRoutes = filterRoutes(asyncRoutes, firstPerms, secondPerms)
    // fiterFinisedRoutes 有资格进入到路由系统中的动态路由表
    console.log('最终路由表:', filterFinishedRoutes)
    filterFinishedRoutes.forEach(route => {
      router.addRoute(route)
    })

    // 5. 触发menu中的mutation函数把动态路由表传过去
    store.commit('menu/setMenuList', filterFinishedRoutes)
  } else {
    // 没有
    if (WHITE_LIST.includes(to.path)) {
      // 在白名单内
      next()
    } else {
      // 不在白名单
      router.push('/login')
    }
  }
})
