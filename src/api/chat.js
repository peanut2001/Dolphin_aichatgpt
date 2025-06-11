/**
 * 聊天相关API服务
 */

import request, { upload } from '@/utils/request'
import { CHAT_API } from './constants'

/**
 * 聊天API服务类
 */
export class ChatService {
  /**
   * 发送消息
   * @param {Object} messageData 消息数据
   * @param {string} messageData.content 消息内容
   * @param {string} messageData.conversationId 对话ID
   * @param {string} messageData.type 消息类型 (text|image)
   * @param {Array} messageData.attachments 附件列表
   * @returns {Promise} 发送结果
   */
  static async sendMessage(messageData) {
    try {
      const response = await request.post(CHAT_API.SEND_MESSAGE, messageData)

      return {
        success: true,
        data: response,
        message: '消息发送成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '消息发送失败'
      }
    }
  }

  /**
   * 获取聊天历史
   * @param {Object} params 查询参数
   * @param {string} params.conversationId 对话ID
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} params.before 获取此时间之前的消息
   * @returns {Promise} 聊天历史
   */
  static async getChatHistory(params) {
    try {
      const response = await request.get(CHAT_API.GET_HISTORY, params)

      return {
        success: true,
        data: response,
        message: '获取聊天历史成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取聊天历史失败'
      }
    }
  }

  /**
   * 获取对话列表
   * @param {Object} params 查询参数
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @param {string} params.keyword 搜索关键词
   * @returns {Promise} 对话列表
   */
  static async getConversations(params = {}) {
    try {
      const response = await request.get(CHAT_API.GET_CONVERSATIONS, params)

      return {
        success: true,
        data: response,
        message: '获取对话列表成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取对话列表失败'
      }
    }
  }

  /**
   * 创建新对话
   * @param {Object} conversationData 对话数据
   * @param {string} conversationData.title 对话标题
   * @param {string} conversationData.description 对话描述
   * @returns {Promise} 创建结果
   */
  static async createConversation(conversationData = {}) {
    try {
      const response = await request.post(CHAT_API.CREATE_CONVERSATION, conversationData)

      return {
        success: true,
        data: response,
        message: '创建对话成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '创建对话失败'
      }
    }
  }

  /**
   * 删除对话
   * @param {string} conversationId 对话ID
   * @returns {Promise} 删除结果
   */
  static async deleteConversation(conversationId) {
    try {
      const response = await request.delete(`${CHAT_API.DELETE_CONVERSATION}/${conversationId}`)

      return {
        success: true,
        data: response,
        message: '删除对话成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '删除对话失败'
      }
    }
  }

  /**
   * 重命名对话
   * @param {string} conversationId 对话ID
   * @param {string} title 新标题
   * @returns {Promise} 重命名结果
   */
  static async renameConversation(conversationId, title) {
    try {
      const response = await request.put(`${CHAT_API.RENAME_CONVERSATION}/${conversationId}`, {
        title
      })

      return {
        success: true,
        data: response,
        message: '对话重命名成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '对话重命名失败'
      }
    }
  }

  /**
   * 上传聊天图片
   * @param {File} file 图片文件
   * @param {string} conversationId 对话ID
   * @returns {Promise} 上传结果
   */
  static async uploadChatImage(file, conversationId) {
    try {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件类型，请上传 JPG、PNG、GIF 或 WebP 格式的图片')
      }

      // 验证文件大小 (10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('文件大小不能超过 10MB')
      }

      const formData = new FormData()
      formData.append('image', file)
      formData.append('conversationId', conversationId)

      const response = await upload(CHAT_API.UPLOAD_IMAGE, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`图片上传进度: ${progress}%`)
        }
      })

      return {
        success: true,
        data: response,
        message: '图片上传成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '图片上传失败'
      }
    }
  }

  /**
   * 获取聊天图片列表
   * @param {Object} params 查询参数
   * @param {string} params.conversationId 对话ID
   * @param {number} params.page 页码
   * @param {number} params.pageSize 每页数量
   * @returns {Promise} 图片列表
   */
  static async getChatImages(params = {}) {
    try {
      const response = await request.get(CHAT_API.GET_IMAGES, params)

      return {
        success: true,
        data: response,
        message: '获取图片列表成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '获取图片列表失败'
      }
    }
  }

  /**
   * 获取AI回复
   * @param {Object} requestData 请求数据
   * @param {string} requestData.message 用户消息
   * @param {string} requestData.conversationId 对话ID
   * @param {Array} requestData.context 上下文消息
   * @param {Object} requestData.options AI选项配置
   * @returns {Promise} AI回复结果
   */
  static async getAIReply(requestData) {
    try {
      const response = await request.post(CHAT_API.AI_REPLY, requestData)

      return {
        success: true,
        data: response,
        message: 'AI回复成功'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'AI回复失败'
      }
    }
  }

  /**
   * 停止AI生成
   * @param {string} conversationId 对话ID
   * @returns {Promise} 停止结果
   */
  static async stopAIGeneration(conversationId) {
    try {
      const response = await request.post(CHAT_API.STOP_GENERATION, {
        conversationId
      })

      return {
        success: true,
        data: response,
        message: '已停止AI生成'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '停止AI生成失败'
      }
    }
  }

  /**
   * 流式获取AI回复
   * @param {Object} requestData 请求数据
   * @param {Function} onMessage 消息回调函数
   * @param {Function} onError 错误回调函数
   * @param {Function} onComplete 完成回调函数
   * @returns {Promise} 流式请求控制器
   */
  static async getAIReplyStream(requestData, onMessage, onError, onComplete) {
    try {
      const controller = new AbortController()
      
      const response = await fetch(`${request.defaults.baseURL}${CHAT_API.AI_REPLY}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              onComplete && onComplete()
              break
            }

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  onComplete && onComplete()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  onMessage && onMessage(parsed)
                } catch (e) {
                  console.warn('解析流数据失败:', e)
                }
              }
            }
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            onError && onError(error)
          }
        }
      }

      readStream()

      return {
        success: true,
        controller,
        message: '开始流式AI回复'
      }
    } catch (error) {
      onError && onError(error)
      return {
        success: false,
        error: error.message,
        message: '流式AI回复失败'
      }
    }
  }
}

// 导出默认实例
export default ChatService
