/**
 * API服务统一入口
 * 导出所有API服务和工具函数
 */

// 导入axios实例和工具函数
import request, { get, post, put, del, patch, upload, download } from '@/utils/request'

// 导入API常量
import * as constants from './constants'

// 导入各个服务类
import AuthService from './auth'
import UserService from './user'
import ChatService from './chat'
import SystemService from './system'
import FileService from './file'

/**
 * API服务管理类
 * 提供统一的API调用接口和管理功能
 */
export class ApiManager {
  constructor() {
    this.auth = AuthService
    this.user = UserService
    this.chat = ChatService
    this.system = SystemService
    this.file = FileService
  }

  /**
   * 设置全局请求配置
   * @param {Object} config 配置对象
   */
  setGlobalConfig(config) {
    Object.assign(request.defaults, config)
  }

  /**
   * 添加请求拦截器
   * @param {Function} onFulfilled 成功回调
   * @param {Function} onRejected 失败回调
   */
  addRequestInterceptor(onFulfilled, onRejected) {
    return request.interceptors.request.use(onFulfilled, onRejected)
  }

  /**
   * 添加响应拦截器
   * @param {Function} onFulfilled 成功回调
   * @param {Function} onRejected 失败回调
   */
  addResponseInterceptor(onFulfilled, onRejected) {
    return request.interceptors.response.use(onFulfilled, onRejected)
  }

  /**
   * 移除拦截器
   * @param {number} interceptorId 拦截器ID
   * @param {string} type 拦截器类型 ('request' | 'response')
   */
  removeInterceptor(interceptorId, type = 'request') {
    if (type === 'request') {
      request.interceptors.request.eject(interceptorId)
    } else {
      request.interceptors.response.eject(interceptorId)
    }
  }

  /**
   * 取消所有待处理的请求
   */
  cancelAllRequests() {
    // 这里可以实现取消所有请求的逻辑
    console.log('取消所有待处理的请求')
  }

  /**
   * 获取当前网络状态
   * @returns {boolean} 是否在线
   */
  isOnline() {
    return navigator.onLine
  }

  /**
   * 监听网络状态变化
   * @param {Function} onOnline 上线回调
   * @param {Function} onOffline 离线回调
   */
  watchNetworkStatus(onOnline, onOffline) {
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    // 返回清理函数
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }
}

// 创建API管理器实例
const apiManager = new ApiManager()

// 导出API服务类
export {
  AuthService,
  UserService,
  ChatService,
  SystemService,
  FileService
}

// 导出API常量
export {
  constants
}

// 导出axios实例和工具函数
export {
  request,
  get,
  post,
  put,
  del,
  patch,
  upload,
  download
}

// 导出API管理器实例
export default apiManager

// 导出便捷的API调用方法
export const api = {
  // 认证相关
  auth: {
    login: AuthService.login,
    logout: AuthService.logout,
    register: AuthService.register,
    refreshToken: AuthService.refreshToken,
    forgotPassword: AuthService.forgotPassword,
    resetPassword: AuthService.resetPassword,
    verifyEmail: AuthService.verifyEmail,
    sendCode: AuthService.sendVerificationCode,
    isLoggedIn: AuthService.isLoggedIn,
    getCurrentUser: AuthService.getCurrentUser
  },

  // 用户相关
  user: {
    getProfile: UserService.getUserProfile,
    updateProfile: UserService.updateUserProfile,
    uploadAvatar: UserService.uploadAvatar,
    changePassword: UserService.changePassword,
    getStats: UserService.getUserStats,
    getSettings: UserService.getUserSettings,
    updateSettings: UserService.updateUserSettings,
    deleteAccount: UserService.deleteAccount,
    checkUsername: UserService.checkUsernameAvailability,
    checkEmail: UserService.checkEmailAvailability,
    getActivityLog: UserService.getUserActivityLog
  },

  // 聊天相关
  chat: {
    sendMessage: ChatService.sendMessage,
    getHistory: ChatService.getChatHistory,
    getConversations: ChatService.getConversations,
    createConversation: ChatService.createConversation,
    deleteConversation: ChatService.deleteConversation,
    renameConversation: ChatService.renameConversation,
    uploadImage: ChatService.uploadChatImage,
    getImages: ChatService.getChatImages,
    getAIReply: ChatService.getAIReply,
    getAIReplyStream: ChatService.getAIReplyStream,
    stopAIGeneration: ChatService.stopAIGeneration
  },

  // 系统相关
  system: {
    getInfo: SystemService.getSystemInfo,
    healthCheck: SystemService.healthCheck,
    getConfig: SystemService.getSystemConfig,
    submitFeedback: SystemService.submitFeedback,
    submitContact: SystemService.submitContact,
    getVersion: SystemService.getVersionInfo,
    checkUpdate: SystemService.checkUpdate,
    getAnnouncements: SystemService.getAnnouncements,
    getHelp: SystemService.getHelpDocs,
    getFAQ: SystemService.getFAQ,
    logAction: SystemService.logUserAction,
    logError: SystemService.logError,
    getStats: SystemService.getSystemStats
  },

  // 文件相关
  file: {
    upload: FileService.uploadFile,
    uploadMultiple: FileService.uploadMultipleFiles,
    download: FileService.downloadFile,
    delete: FileService.deleteFile,
    deleteMultiple: FileService.deleteMultipleFiles,
    getInfo: FileService.getFileInfo,
    getList: FileService.getFileList,
    getPreviewUrl: FileService.getFilePreviewUrl,
    rename: FileService.renameFile,
    move: FileService.moveFile,
    getCategories: FileService.getFileCategories,
    checkExists: FileService.checkFileExists
  }
}

/**
 * 全局错误处理器
 * 可以在应用启动时调用此函数来设置全局错误处理
 */
export function setupGlobalErrorHandler() {
  // 监听未捕获的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未捕获的Promise错误:', event.reason)
    
    // 记录错误到服务器
    SystemService.logError({
      message: event.reason?.message || '未知错误',
      stack: event.reason?.stack || '',
      type: 'unhandledrejection'
    })
  })

  // 监听全局JavaScript错误
  window.addEventListener('error', (event) => {
    console.error('全局JavaScript错误:', event.error)
    
    // 记录错误到服务器
    SystemService.logError({
      message: event.error?.message || event.message || '未知错误',
      stack: event.error?.stack || '',
      filename: event.filename || '',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      type: 'javascript'
    })
  })
}

/**
 * 初始化API服务
 * 在应用启动时调用
 */
export function initializeApi() {
  // 设置全局错误处理
  setupGlobalErrorHandler()

  // 检查网络状态
  if (!apiManager.isOnline()) {
    console.warn('当前处于离线状态')
  }

  // 监听网络状态变化
  apiManager.watchNetworkStatus(
    () => console.log('网络已连接'),
    () => console.warn('网络已断开')
  )

  console.log('API服务初始化完成')
}
