/**
 * router/index.js
 *
 * Vue Router configuration
 */

import { createRouter, createWebHistory } from "vue-router"
import baseRoutes from "./base.routes"
import { useAuthStore } from "@/stores/authstore"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 初始化认证状态
  authStore.initAuth()

  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isLoggedIn) {
    // 需要认证但未登录，重定向到登录页面
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    // 已登录用户访问登录页面，重定向到首页
    next({ name: 'home' })
  } else {
    // 正常访问
    next()
  }
})

export default router
