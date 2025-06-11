/**
 * 认证相关API服务
 */

import request from '@/utils/request'
import { AUTH_API } from './constants'

/**
 * 认证API服务类
 */
export class AuthService {
  /**
   * 用户登录
   * @param {Object} credentials 登录凭据
   * @param {string} credentials.username 用户名
   * @param {string} credentials.password 密码
   * @param {boolean} credentials.rememberMe 记住我
   * @returns {Promise} 登录结果
   */
  static async login(credentials) {
    try {
      const response = await request.post(AUTH_API.LOGIN, {
        username: credentials.username,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      })

      // 登录成功后保存token
      if (response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('isLoggedIn', 'true')
      }

      return {
        success: true,
        data: response,
        message: '登录成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '登录失败'
      }
    }
  }

  /**
   * 用户登出
   * @returns {Promise} 登出结果
   */
  static async logout() {
    try {
      await request.post(AUTH_API.LOGOUT)
      
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')

      return {
        success: true,
        message: '登出成功'
      }
    } catch (error) {
      // 即使请求失败也要清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')

      return {
        success: false,
        error: error.message,
        message: '登出失败'
      }
    }
  }

  /**
   * 用户注册
   * @param {Object} userData 注册数据
   * @param {string} userData.username 用户名
   * @param {string} userData.email 邮箱
   * @param {string} userData.password 密码
   * @param {string} userData.confirmPassword 确认密码
   * @returns {Promise} 注册结果
   */
  static async register(userData) {
    try {
      const response = await request.post(AUTH_API.REGISTER, userData)

      return {
        success: true,
        data: response,
        message: '注册成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '注册失败'
      }
    }
  }

  /**
   * 刷新token
   * @returns {Promise} 刷新结果
   */
  static async refreshToken() {
    try {
      const response = await request.post(AUTH_API.REFRESH_TOKEN)

      if (response.token) {
        localStorage.setItem('token', response.token)
      }

      return {
        success: true,
        data: response,
        message: 'Token刷新成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Token刷新失败'
      }
    }
  }

  /**
   * 忘记密码
   * @param {string} email 邮箱地址
   * @returns {Promise} 发送结果
   */
  static async forgotPassword(email) {
    try {
      const response = await request.post(AUTH_API.FORGOT_PASSWORD, { email })

      return {
        success: true,
        data: response,
        message: '重置密码邮件已发送'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '发送重置密码邮件失败'
      }
    }
  }

  /**
   * 重置密码
   * @param {Object} resetData 重置数据
   * @param {string} resetData.token 重置token
   * @param {string} resetData.password 新密码
   * @param {string} resetData.confirmPassword 确认密码
   * @returns {Promise} 重置结果
   */
  static async resetPassword(resetData) {
    try {
      const response = await request.post(AUTH_API.RESET_PASSWORD, resetData)

      return {
        success: true,
        data: response,
        message: '密码重置成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '密码重置失败'
      }
    }
  }

  /**
   * 验证邮箱
   * @param {string} token 验证token
   * @returns {Promise} 验证结果
   */
  static async verifyEmail(token) {
    try {
      const response = await request.post(AUTH_API.VERIFY_EMAIL, { token })

      return {
        success: true,
        data: response,
        message: '邮箱验证成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '邮箱验证失败'
      }
    }
  }

  /**
   * 发送验证码
   * @param {Object} codeData 验证码数据
   * @param {string} codeData.email 邮箱地址
   * @param {string} codeData.type 验证码类型 (register|login|reset)
   * @returns {Promise} 发送结果
   */
  static async sendVerificationCode(codeData) {
    try {
      const response = await request.post(AUTH_API.SEND_CODE, codeData)

      return {
        success: true,
        data: response,
        message: '验证码已发送'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '验证码发送失败'
      }
    }
  }

  /**
   * 检查token有效性
   * @returns {boolean} token是否有效
   */
  static isTokenValid() {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      // 简单的token格式检查（实际项目中可能需要更复杂的验证）
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      return payload.exp > currentTime
    } catch (error) {
      return false
    }
  }

  /**
   * 获取当前用户信息
   * @returns {Object|null} 用户信息
   */
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      return null
    }
  }

  /**
   * 检查是否已登录
   * @returns {boolean} 是否已登录
   */
  static isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true' && this.isTokenValid()
  }
}

// 导出默认实例
export default AuthService
