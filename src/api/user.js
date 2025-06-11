/**
 * 用户相关API服务
 */

import request, { upload } from '@/utils/request'
import { USER_API } from './constants'

/**
 * 用户API服务类
 */
export class UserService {
  /**
   * 获取用户资料
   * @returns {Promise} 用户资料数据
   */
  static async getUserProfile() {
    try {
      const response = await request.get(USER_API.GET_PROFILE)

      return {
        success: true,
        data: response,
        message: '获取用户资料成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取用户资料失败'
      }
    }
  }

  /**
   * 更新用户资料
   * @param {Object} profileData 用户资料数据
   * @param {string} profileData.nickname 昵称
   * @param {string} profileData.bio 个人简介
   * @param {string} profileData.location 所在地
   * @param {string} profileData.website 个人网站
   * @param {string} profileData.phone 手机号
   * @returns {Promise} 更新结果
   */
  static async updateUserProfile(profileData) {
    try {
      const response = await request.put(USER_API.UPDATE_PROFILE, profileData)

      // 更新本地存储的用户信息
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...currentUser, ...response }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return {
        success: true,
        data: response,
        message: '用户资料更新成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '用户资料更新失败'
      }
    }
  }

  /**
   * 上传用户头像
   * @param {File} file 头像文件
   * @returns {Promise} 上传结果
   */
  static async uploadAvatar(file) {
    try {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件类型，请上传 JPG、PNG、GIF 或 WebP 格式的图片')
      }

      // 验证文件大小 (5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('文件大小不能超过 5MB')
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await upload(USER_API.UPLOAD_AVATAR, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`头像上传进度: ${progress}%`)
        }
      })

      // 更新本地存储的用户头像
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      currentUser.avatar = response.avatarUrl
      localStorage.setItem('user', JSON.stringify(currentUser))

      return {
        success: true,
        data: response,
        message: '头像上传成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '头像上传失败'
      }
    }
  }

  /**
   * 修改密码
   * @param {Object} passwordData 密码数据
   * @param {string} passwordData.oldPassword 旧密码
   * @param {string} passwordData.newPassword 新密码
   * @param {string} passwordData.confirmPassword 确认密码
   * @returns {Promise} 修改结果
   */
  static async changePassword(passwordData) {
    try {
      const response = await request.put(USER_API.CHANGE_PASSWORD, passwordData)

      return {
        success: true,
        data: response,
        message: '密码修改成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '密码修改失败'
      }
    }
  }

  /**
   * 获取用户统计信息
   * @returns {Promise} 统计信息
   */
  static async getUserStats() {
    try {
      const response = await request.get(USER_API.GET_STATS)

      return {
        success: true,
        data: response,
        message: '获取用户统计成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取用户统计失败'
      }
    }
  }

  /**
   * 获取用户设置
   * @returns {Promise} 用户设置
   */
  static async getUserSettings() {
    try {
      const response = await request.get(USER_API.GET_SETTINGS)

      return {
        success: true,
        data: response,
        message: '获取用户设置成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取用户设置失败'
      }
    }
  }

  /**
   * 更新用户设置
   * @param {Object} settings 设置数据
   * @param {string} settings.theme 主题设置
   * @param {string} settings.language 语言设置
   * @param {boolean} settings.notifications 通知设置
   * @param {Object} settings.privacy 隐私设置
   * @returns {Promise} 更新结果
   */
  static async updateUserSettings(settings) {
    try {
      const response = await request.put(USER_API.UPDATE_SETTINGS, settings)

      return {
        success: true,
        data: response,
        message: '用户设置更新成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '用户设置更新失败'
      }
    }
  }

  /**
   * 删除用户账户
   * @param {string} password 确认密码
   * @returns {Promise} 删除结果
   */
  static async deleteAccount(password) {
    try {
      const response = await request.delete(USER_API.DELETE_ACCOUNT, {
        password
      })

      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')

      return {
        success: true,
        data: response,
        message: '账户删除成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '账户删除失败'
      }
    }
  }

  /**
   * 验证用户名是否可用
   * @param {string} username 用户名
   * @returns {Promise} 验证结果
   */
  static async checkUsernameAvailability(username) {
    try {
      const response = await request.get('/user/check-username', {
        username
      })

      return {
        success: true,
        data: response,
        message: response.available ? '用户名可用' : '用户名已被使用'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '用户名验证失败'
      }
    }
  }

  /**
   * 验证邮箱是否可用
   * @param {string} email 邮箱地址
   * @returns {Promise} 验证结果
   */
  static async checkEmailAvailability(email) {
    try {
      const response = await request.get('/user/check-email', {
        email
      })

      return {
        success: true,
        data: response,
        message: response.available ? '邮箱可用' : '邮箱已被使用'
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
   * 获取用户活动日志
   * @param {Object} params 查询参数
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} params.type 活动类型
   * @returns {Promise} 活动日志
   */
  static async getUserActivityLog(params = {}) {
    try {
      const response = await request.get('/user/activity-log', params)

      return {
        success: true,
        data: response,
        message: '获取活动日志成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取活动日志失败'
      }
    }
  }
}

// 导出默认实例
export default UserService
