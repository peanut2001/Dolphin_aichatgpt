/**
 * HTTP请求工具函数
 * 提供常用的请求处理和数据转换功能
 */

/**
 * 构建查询字符串
 * @param {Object} params 参数对象
 * @returns {string} 查询字符串
 */
export function buildQueryString(params) {
  if (!params || typeof params !== 'object') {
    return ''
  }

  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item))
      } else {
        searchParams.append(key, value)
      }
    }
  })

  return searchParams.toString()
}

/**
 * 解析查询字符串
 * @param {string} queryString 查询字符串
 * @returns {Object} 参数对象
 */
export function parseQueryString(queryString) {
  const params = {}
  const searchParams = new URLSearchParams(queryString)
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      // 如果已存在该键，转换为数组
      if (Array.isArray(params[key])) {
        params[key].push(value)
      } else {
        params[key] = [params[key], value]
      }
    } else {
      params[key] = value
    }
  }
  
  return params
}

/**
 * 格式化请求URL
 * @param {string} baseUrl 基础URL
 * @param {string} path 路径
 * @param {Object} params 查询参数
 * @returns {string} 完整URL
 */
export function formatUrl(baseUrl, path, params) {
  let url = baseUrl.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
  
  if (params && Object.keys(params).length > 0) {
    const queryString = buildQueryString(params)
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }
  
  return url
}

/**
 * 深度合并对象
 * @param {Object} target 目标对象
 * @param {...Object} sources 源对象
 * @returns {Object} 合并后的对象
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * 判断是否为对象
 * @param {*} item 要判断的项
 * @returns {boolean} 是否为对象
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间限制
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 重试函数
 * @param {Function} fn 要重试的函数
 * @param {number} retries 重试次数
 * @param {number} delay 重试延迟
 * @returns {Promise} 重试结果
 */
export async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return retry(fn, retries - 1, delay * 2) // 指数退避
    }
    throw error
  }
}

/**
 * 超时Promise
 * @param {Promise} promise 原Promise
 * @param {number} timeout 超时时间
 * @returns {Promise} 带超时的Promise
 */
export function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ])
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @param {number} decimals 小数位数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 验证文件类型
 * @param {File} file 文件对象
 * @param {Array} allowedTypes 允许的文件类型
 * @returns {boolean} 是否为允许的类型
 */
export function validateFileType(file, allowedTypes) {
  if (!file || !allowedTypes || !Array.isArray(allowedTypes)) {
    return false
  }
  return allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 * @param {File} file 文件对象
 * @param {number} maxSize 最大文件大小（字节）
 * @returns {boolean} 是否符合大小限制
 */
export function validateFileSize(file, maxSize) {
  if (!file || typeof maxSize !== 'number') {
    return false
  }
  return file.size <= maxSize
}

/**
 * 获取文件扩展名
 * @param {string} filename 文件名
 * @returns {string} 文件扩展名
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    return ''
  }
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * 生成唯一ID
 * @param {number} length ID长度
 * @returns {string} 唯一ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 格式化日期
 * @param {Date|string|number} date 日期
 * @param {string} format 格式字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 获取相对时间
 * @param {Date|string|number} date 日期
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()

  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前'
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前'
  } else if (diff < year) {
    return Math.floor(diff / month) + '个月前'
  } else {
    return Math.floor(diff / year) + '年前'
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    return false
  }
}
