import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
  // 状态
  const isLoggedIn = ref(false)
  const user = ref(null)
  const loading = ref(false)
  const error = ref("")

  // 登录方法
  const login = async (credentials) => {
    loading.value = true
    error.value = ""

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 简单的验证逻辑（实际项目中应该调用真实 API）
      if (credentials.username === "admin" && credentials.password === "123456") {
        user.value = {
          id: 1,
          username: credentials.username,
          name: "管理员",
        }
        isLoggedIn.value = true

        // 保存到 localStorage
        localStorage.setItem("user", JSON.stringify(user.value))
        localStorage.setItem("isLoggedIn", "true")

        return { success: true }
      } else {
        throw new Error("用户名或密码错误")
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // 登出方法
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    error.value = ""

    // 清除 localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
  }

  // 初始化认证状态
  const initAuth = () => {
    const savedUser = localStorage.getItem("user")
    const savedLoginStatus = localStorage.getItem("isLoggedIn")

    if (savedUser && savedLoginStatus === "true") {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = ""
  }

  // 更新用户信息
  const updateUser = (userData) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      // 更新 localStorage
      localStorage.setItem("user", JSON.stringify(user.value))
    }
  }

  return {
    // 状态
    isLoggedIn,
    user,
    loading,
    error,

    // 方法
    login,
    logout,
    initAuth,
    clearError,
    updateUser,
  }
})
