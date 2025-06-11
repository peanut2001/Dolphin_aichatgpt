/**
 * axios 请求封装
 * 统一处理请求和响应
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/authstore'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求ID用于追踪
    config.headers['X-Request-ID'] = generateRequestId()

    console.log('🚀 发送请求:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data
    })

    return config
  },
  (error) => {
    console.error('❌ 请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    console.log('✅ 响应成功:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })

    // 统一处理响应数据格式
    const { data, code, message } = response.data

    // 根据业务状态码处理
    if (code === 200 || code === 0) {
      return data
    } else if (code === 401) {
      // 未授权，清除token并跳转登录
      handleUnauthorized()
      return Promise.reject(new Error(message || '未授权访问'))
    } else if (code === 403) {
      // 禁止访问
      return Promise.reject(new Error(message || '禁止访问'))
    } else if (code === 404) {
      // 资源不存在
      return Promise.reject(new Error(message || '请求的资源不存在'))
    } else if (code >= 500) {
      // 服务器错误
      return Promise.reject(new Error(message || '服务器内部错误'))
    } else {
      // 其他业务错误
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    console.error('❌ 响应错误:', error)

    // 网络错误处理
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('请求超时，请稍后重试'))
      } else if (error.message === 'Network Error') {
        return Promise.reject(new Error('网络连接失败，请检查网络'))
      } else {
        return Promise.reject(new Error('网络异常，请稍后重试'))
      }
    }

    // HTTP状态码错误处理
    const { status, data } = error.response
    let message = '请求失败'

    switch (status) {
      case 400:
        message = data?.message || '请求参数错误'
        break
      case 401:
        message = '未授权访问'
        handleUnauthorized()
        break
      case 403:
        message = '禁止访问'
        break
      case 404:
        message = '请求的资源不存在'
        break
      case 408:
        message = '请求超时'
        break
      case 429:
        message = '请求过于频繁，请稍后重试'
        break
      case 500:
        message = '服务器内部错误'
        break
      case 502:
        message = '网关错误'
        break
      case 503:
        message = '服务暂不可用'
        break
      case 504:
        message = '网关超时'
        break
      default:
        message = data?.message || `请求失败 (${status})`
    }

    return Promise.reject(new Error(message))
  }
)

// 处理未授权情况
function handleUnauthorized() {
  // 清除本地存储的认证信息
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')

  // 更新认证状态
  const authStore = useAuthStore()
  authStore.logout()

  // 跳转到登录页面
  if (window.location.pathname !== '/auth/login') {
    window.location.href = '/auth/login'
  }
}

// 生成请求ID
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 导出请求方法
export default request

// 导出常用的请求方法
export const get = (url, params = {}, config = {}) => {
  return request({
    method: 'get',
    url,
    params,
    ...config
  })
}

export const post = (url, data = {}, config = {}) => {
  return request({
    method: 'post',
    url,
    data,
    ...config
  })
}

export const put = (url, data = {}, config = {}) => {
  return request({
    method: 'put',
    url,
    data,
    ...config
  })
}

export const del = (url, params = {}, config = {}) => {
  return request({
    method: 'delete',
    url,
    params,
    ...config
  })
}

export const patch = (url, data = {}, config = {}) => {
  return request({
    method: 'patch',
    url,
    data,
    ...config
  })
}

// 文件上传
export const upload = (url, formData, config = {}) => {
  return request({
    method: 'post',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

// 文件下载
export const download = (url, params = {}, config = {}) => {
  return request({
    method: 'get',
    url,
    params,
    responseType: 'blob',
    ...config
  })
}
