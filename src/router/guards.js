/**
 * 路由守卫 - 导航拦截逻辑
 */

import { useUserStore } from '@/store/modules/userStore'

/**
 * 设置页面标题
 */
function setPageTitle(to) {
  const defaultTitle = 'VueForge'
  document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle
}

/**
 * 检查登录状态
 */
function checkAuth(to, from, next) {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn

  // 需要登录但未登录 → 跳转登录
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }, // 登录后跳回原页面
    })
  }

  // 已登录但访问游客页面（如登录页）→ 跳转首页
  if (to.meta.requiresGuest && isLoggedIn) {
    return next({ path: '/' })
  }

  next()
}

/**
 * 注册所有守卫
 */
export function setupRouterGuards(router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    setPageTitle(to)
    checkAuth(to, from, next)
  })

  // 全局后置钩子（可以做埋点、滚动位置恢复等）
  router.afterEach((to, from) => {
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // 全局错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
  })
}