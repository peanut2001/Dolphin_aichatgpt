/**
 * API 接口常量定义
 * 统一管理所有API接口地址
 */

// 基础配置
export const API_CONFIG = {
  // API版本
  VERSION: 'v1',
  
  // 请求超时时间
  TIMEOUT: 15000,
  
  // 分页默认配置
  PAGE_SIZE: 20,
  
  // 文件上传限制
  UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  UPLOAD_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}

// 认证相关接口
export const AUTH_API = {
  // 登录
  LOGIN: '/auth/login',
  
  // 登出
  LOGOUT: '/auth/logout',
  
  // 注册
  REGISTER: '/auth/register',
  
  // 刷新token
  REFRESH_TOKEN: '/auth/refresh',
  
  // 忘记密码
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // 重置密码
  RESET_PASSWORD: '/auth/reset-password',
  
  // 验证邮箱
  VERIFY_EMAIL: '/auth/verify-email',
  
  // 发送验证码
  SEND_CODE: '/auth/send-code'
}

// 用户相关接口
export const USER_API = {
  // 获取用户信息
  GET_PROFILE: '/user/profile',
  
  // 更新用户信息
  UPDATE_PROFILE: '/user/profile',
  
  // 上传头像
  UPLOAD_AVATAR: '/user/avatar',
  
  // 修改密码
  CHANGE_PASSWORD: '/user/change-password',
  
  // 获取用户统计
  GET_STATS: '/user/stats',
  
  // 获取用户设置
  GET_SETTINGS: '/user/settings',
  
  // 更新用户设置
  UPDATE_SETTINGS: '/user/settings',
  
  // 删除账户
  DELETE_ACCOUNT: '/user/delete'
}

// 聊天相关接口
export const CHAT_API = {
  // 发送消息
  SEND_MESSAGE: '/chat/send',
  
  // 获取聊天历史
  GET_HISTORY: '/chat/history',
  
  // 获取对话列表
  GET_CONVERSATIONS: '/chat/conversations',
  
  // 创建新对话
  CREATE_CONVERSATION: '/chat/conversations',
  
  // 删除对话
  DELETE_CONVERSATION: '/chat/conversations',
  
  // 重命名对话
  RENAME_CONVERSATION: '/chat/conversations',
  
  // 上传图片
  UPLOAD_IMAGE: '/chat/upload/image',
  
  // 获取图片列表
  GET_IMAGES: '/chat/images',
  
  // AI回复
  AI_REPLY: '/chat/ai/reply',
  
  // 停止生成
  STOP_GENERATION: '/chat/ai/stop'
}

// 文件相关接口
export const FILE_API = {
  // 文件上传
  UPLOAD: '/file/upload',
  
  // 文件下载
  DOWNLOAD: '/file/download',
  
  // 文件删除
  DELETE: '/file/delete',
  
  // 获取文件信息
  GET_INFO: '/file/info',
  
  // 获取文件列表
  GET_LIST: '/file/list'
}

// 系统相关接口
export const SYSTEM_API = {
  // 获取系统信息
  GET_INFO: '/system/info',
  
  // 健康检查
  HEALTH_CHECK: '/system/health',
  
  // 获取配置
  GET_CONFIG: '/system/config',
  
  // 意见反馈
  FEEDBACK: '/system/feedback',
  
  // 联系我们
  CONTACT: '/system/contact'
}

// WebSocket相关配置
export const WS_CONFIG = {
  // WebSocket连接地址
  URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
  
  // 重连配置
  RECONNECT_INTERVAL: 3000,
  MAX_RECONNECT_ATTEMPTS: 5,
  
  // 心跳配置
  HEARTBEAT_INTERVAL: 30000,
  HEARTBEAT_TIMEOUT: 5000
}

// 错误码定义
export const ERROR_CODES = {
  // 成功
  SUCCESS: 200,
  
  // 客户端错误
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 服务器错误
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// 业务状态码
export const BUSINESS_CODES = {
  SUCCESS: 0,
  FAILED: -1,
  
  // 认证相关
  TOKEN_EXPIRED: 1001,
  TOKEN_INVALID: 1002,
  LOGIN_REQUIRED: 1003,
  PERMISSION_DENIED: 1004,
  
  // 用户相关
  USER_NOT_FOUND: 2001,
  USER_ALREADY_EXISTS: 2002,
  PASSWORD_INCORRECT: 2003,
  EMAIL_NOT_VERIFIED: 2004,
  
  // 参数相关
  PARAM_MISSING: 3001,
  PARAM_INVALID: 3002,
  PARAM_FORMAT_ERROR: 3003,
  
  // 文件相关
  FILE_TOO_LARGE: 4001,
  FILE_TYPE_NOT_ALLOWED: 4002,
  FILE_UPLOAD_FAILED: 4003,
  FILE_NOT_FOUND: 4004,
  
  // 业务相关
  OPERATION_FAILED: 5001,
  DATA_NOT_FOUND: 5002,
  DATA_ALREADY_EXISTS: 5003,
  OPERATION_NOT_ALLOWED: 5004
}

// 请求方法常量
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
}

// 内容类型常量
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml'
}
