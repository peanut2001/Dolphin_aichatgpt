/**
 * 系统相关API服务
 */

import request from '@/utils/request'
import { SYSTEM_API } from './constants'

/**
 * 系统API服务类
 */
export class SystemService {
  /**
   * 获取系统信息
   * @returns {Promise} 系统信息
   */
  static async getSystemInfo() {
    try {
      const response = await request.get(SYSTEM_API.GET_INFO)

      return {
        success: true,
        data: response,
        message: '获取系统信息成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取系统信息失败'
      }
    }
  }

  /**
   * 系统健康检查
   * @returns {Promise} 健康状态
   */
  static async healthCheck() {
    try {
      const response = await request.get(SYSTEM_API.HEALTH_CHECK)

      return {
        success: true,
        data: response,
        message: '系统健康检查成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '系统健康检查失败'
      }
    }
  }

  /**
   * 获取系统配置
   * @returns {Promise} 系统配置
   */
  static async getSystemConfig() {
    try {
      const response = await request.get(SYSTEM_API.GET_CONFIG)

      return {
        success: true,
        data: response,
        message: '获取系统配置成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取系统配置失败'
      }
    }
  }

  /**
   * 提交意见反馈
   * @param {Object} feedbackData 反馈数据
   * @param {string} feedbackData.type 反馈类型
   * @param {string} feedbackData.title 反馈标题
   * @param {string} feedbackData.content 反馈内容
   * @param {string} feedbackData.contact 联系方式
   * @param {Array} feedbackData.attachments 附件列表
   * @returns {Promise} 提交结果
   */
  static async submitFeedback(feedbackData) {
    try {
      const response = await request.post(SYSTEM_API.FEEDBACK, feedbackData)

      return {
        success: true,
        data: response,
        message: '反馈提交成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '反馈提交失败'
      }
    }
  }

  /**
   * 联系我们
   * @param {Object} contactData 联系数据
   * @param {string} contactData.name 姓名
   * @param {string} contactData.email 邮箱
   * @param {string} contactData.subject 主题
   * @param {string} contactData.message 消息内容
   * @returns {Promise} 提交结果
   */
  static async submitContact(contactData) {
    try {
      const response = await request.post(SYSTEM_API.CONTACT, contactData)

      return {
        success: true,
        data: response,
        message: '联系信息提交成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '联系信息提交失败'
      }
    }
  }

  /**
   * 获取应用版本信息
   * @returns {Promise} 版本信息
   */
  static async getVersionInfo() {
    try {
      const response = await request.get('/system/version')

      return {
        success: true,
        data: response,
        message: '获取版本信息成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取版本信息失败'
      }
    }
  }

  /**
   * 检查应用更新
   * @returns {Promise} 更新信息
   */
  static async checkUpdate() {
    try {
      const response = await request.get('/system/check-update')

      return {
        success: true,
        data: response,
        message: response.hasUpdate ? '发现新版本' : '已是最新版本'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '检查更新失败'
      }
    }
  }

  /**
   * 获取系统公告
   * @param {Object} params 查询参数
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} params.type 公告类型
   * @returns {Promise} 公告列表
   */
  static async getAnnouncements(params = {}) {
    try {
      const response = await request.get('/system/announcements', params)

      return {
        success: true,
        data: response,
        message: '获取系统公告成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取系统公告失败'
      }
    }
  }

  /**
   * 获取帮助文档
   * @param {string} category 文档分类
   * @returns {Promise} 帮助文档
   */
  static async getHelpDocs(category = '') {
    try {
      const response = await request.get('/system/help', { category })

      return {
        success: true,
        data: response,
        message: '获取帮助文档成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取帮助文档失败'
      }
    }
  }

  /**
   * 获取常见问题
   * @param {string} keyword 搜索关键词
   * @returns {Promise} 常见问题列表
   */
  static async getFAQ(keyword = '') {
    try {
      const response = await request.get('/system/faq', { keyword })

      return {
        success: true,
        data: response,
        message: '获取常见问题成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取常见问题失败'
      }
    }
  }

  /**
   * 记录用户行为
   * @param {Object} actionData 行为数据
   * @param {string} actionData.action 行为类型
   * @param {string} actionData.page 页面路径
   * @param {Object} actionData.data 附加数据
   * @returns {Promise} 记录结果
   */
  static async logUserAction(actionData) {
    try {
      const response = await request.post('/system/log/action', actionData)

      return {
        success: true,
        data: response,
        message: '行为记录成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '行为记录失败'
      }
    }
  }

  /**
   * 记录错误信息
   * @param {Object} errorData 错误数据
   * @param {string} errorData.message 错误消息
   * @param {string} errorData.stack 错误堆栈
   * @param {string} errorData.url 错误页面
   * @param {Object} errorData.userAgent 用户代理
   * @returns {Promise} 记录结果
   */
  static async logError(errorData) {
    try {
      const response = await request.post('/system/log/error', {
        ...errorData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })

      return {
        success: true,
        data: response,
        message: '错误记录成功'
      }
    } catch (error) {
      // 错误记录失败时不抛出异常，避免循环错误
      console.error('错误记录失败:', error)
      return {
        success: false,
        error: error.message,
        message: '错误记录失败'
      }
    }
  }

  /**
   * 获取系统统计信息
   * @param {Object} params 查询参数
   * @param {string} params.startDate 开始日期
   * @param {string} params.endDate 结束日期
   * @param {string} params.type 统计类型
   * @returns {Promise} 统计信息
   */
  static async getSystemStats(params = {}) {
    try {
      const response = await request.get('/system/stats', params)

      return {
        success: true,
        data: response,
        message: '获取系统统计成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取系统统计失败'
      }
    }
  }
}

// 导出默认实例
export default SystemService
