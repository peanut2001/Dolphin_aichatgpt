/**
 * 文件相关API服务
 */

import request, { upload, download } from '@/utils/request'
import { FILE_API, API_CONFIG } from './constants'

/**
 * 文件API服务类
 */
export class FileService {
  /**
   * 上传文件
   * @param {File} file 文件对象
   * @param {Object} options 上传选项
   * @param {string} options.category 文件分类
   * @param {Function} options.onProgress 进度回调
   * @param {Object} options.metadata 文件元数据
   * @returns {Promise} 上传结果
   */
  static async uploadFile(file, options = {}) {
    try {
      // 文件大小验证
      if (file.size > API_CONFIG.UPLOAD_MAX_SIZE) {
        throw new Error(`文件大小不能超过 ${API_CONFIG.UPLOAD_MAX_SIZE / 1024 / 1024}MB`)
      }

      // 文件类型验证（如果指定了允许的类型）
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件类型')
      }

      const formData = new FormData()
      formData.append('file', file)
      
      if (options.category) {
        formData.append('category', options.category)
      }
      
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata))
      }

      const response = await upload(FILE_API.UPLOAD, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          options.onProgress && options.onProgress(progress)
        }
      })

      return {
        success: true,
        data: response,
        message: '文件上传成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '文件上传失败'
      }
    }
  }

  /**
   * 批量上传文件
   * @param {FileList|Array} files 文件列表
   * @param {Object} options 上传选项
   * @param {string} options.category 文件分类
   * @param {Function} options.onProgress 总体进度回调
   * @param {Function} options.onFileProgress 单个文件进度回调
   * @returns {Promise} 上传结果
   */
  static async uploadMultipleFiles(files, options = {}) {
    try {
      const fileArray = Array.from(files)
      const results = []
      let completedCount = 0

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        
        const result = await this.uploadFile(file, {
          ...options,
          onProgress: (progress) => {
            options.onFileProgress && options.onFileProgress(i, progress)
            
            // 计算总体进度
            const totalProgress = Math.round(
              ((completedCount + progress / 100) / fileArray.length) * 100
            )
            options.onProgress && options.onProgress(totalProgress)
          }
        })

        results.push(result)
        completedCount++
      }

      const successCount = results.filter(r => r.success).length
      const failCount = results.length - successCount

      return {
        success: failCount === 0,
        data: {
          results,
          summary: {
            total: results.length,
            success: successCount,
            failed: failCount
          }
        },
        message: `批量上传完成：成功 ${successCount} 个，失败 ${failCount} 个`
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '批量上传失败'
      }
    }
  }

  /**
   * 下载文件
   * @param {string} fileId 文件ID
   * @param {string} filename 文件名（可选）
   * @returns {Promise} 下载结果
   */
  static async downloadFile(fileId, filename) {
    try {
      const response = await download(`${FILE_API.DOWNLOAD}/${fileId}`)

      // 创建下载链接
      const blob = new Blob([response])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `file_${fileId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return {
        success: true,
        message: '文件下载成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '文件下载失败'
      }
    }
  }

  /**
   * 删除文件
   * @param {string} fileId 文件ID
   * @returns {Promise} 删除结果
   */
  static async deleteFile(fileId) {
    try {
      const response = await request.delete(`${FILE_API.DELETE}/${fileId}`)

      return {
        success: true,
        data: response,
        message: '文件删除成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '文件删除失败'
      }
    }
  }

  /**
   * 批量删除文件
   * @param {Array} fileIds 文件ID列表
   * @returns {Promise} 删除结果
   */
  static async deleteMultipleFiles(fileIds) {
    try {
      const response = await request.delete(FILE_API.DELETE, {
        fileIds
      })

      return {
        success: true,
        data: response,
        message: '批量删除成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '批量删除失败'
      }
    }
  }

  /**
   * 获取文件信息
   * @param {string} fileId 文件ID
   * @returns {Promise} 文件信息
   */
  static async getFileInfo(fileId) {
    try {
      const response = await request.get(`${FILE_API.GET_INFO}/${fileId}`)

      return {
        success: true,
        data: response,
        message: '获取文件信息成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取文件信息失败'
      }
    }
  }

  /**
   * 获取文件列表
   * @param {Object} params 查询参数
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} params.category 文件分类
   * @param {string} params.keyword 搜索关键词
   * @param {string} params.sortBy 排序字段
   * @param {string} params.sortOrder 排序方向
   * @returns {Promise} 文件列表
   */
  static async getFileList(params = {}) {
    try {
      const response = await request.get(FILE_API.GET_LIST, params)

      return {
        success: true,
        data: response,
        message: '获取文件列表成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取文件列表失败'
      }
    }
  }

  /**
   * 获取文件预览URL
   * @param {string} fileId 文件ID
   * @param {Object} options 预览选项
   * @param {number} options.width 预览宽度
   * @param {number} options.height 预览高度
   * @param {string} options.quality 预览质量
   * @returns {Promise} 预览URL
   */
  static async getFilePreviewUrl(fileId, options = {}) {
    try {
      const response = await request.get(`/file/preview/${fileId}`, options)

      return {
        success: true,
        data: response,
        message: '获取预览URL成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取预览URL失败'
      }
    }
  }

  /**
   * 文件重命名
   * @param {string} fileId 文件ID
   * @param {string} newName 新文件名
   * @returns {Promise} 重命名结果
   */
  static async renameFile(fileId, newName) {
    try {
      const response = await request.put(`/file/rename/${fileId}`, {
        name: newName
      })

      return {
        success: true,
        data: response,
        message: '文件重命名成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '文件重命名失败'
      }
    }
  }

  /**
   * 文件移动
   * @param {string} fileId 文件ID
   * @param {string} targetCategory 目标分类
   * @returns {Promise} 移动结果
   */
  static async moveFile(fileId, targetCategory) {
    try {
      const response = await request.put(`/file/move/${fileId}`, {
        category: targetCategory
      })

      return {
        success: true,
        data: response,
        message: '文件移动成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '文件移动失败'
      }
    }
  }

  /**
   * 获取文件分类列表
   * @returns {Promise} 分类列表
   */
  static async getFileCategories() {
    try {
      const response = await request.get('/file/categories')

      return {
        success: true,
        data: response,
        message: '获取文件分类成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取文件分类失败'
      }
    }
  }

  /**
   * 检查文件是否存在
   * @param {string} filename 文件名
   * @param {string} hash 文件哈希值
   * @returns {Promise} 检查结果
   */
  static async checkFileExists(filename, hash) {
    try {
      const response = await request.get('/file/check-exists', {
        filename,
        hash
      })

      return {
        success: true,
        data: response,
        message: response.exists ? '文件已存在' : '文件不存在'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '检查文件失败'
      }
    }
  }
}

// 导出默认实例
export default FileService
