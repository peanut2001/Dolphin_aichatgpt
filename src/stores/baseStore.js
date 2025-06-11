import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
  state: () => ({
    // 应用全局状态
    loading: false,
    theme: 'light',
  }),
  actions: {
    setLoading(loading) {
      this.loading = loading
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
})

// 聊天状态管理
export const useChatStore = defineStore("chat", {
  state: () => ({
    // 聊天相关状态
    messages: [],
    currentConversationId: null,
    isLoading: false,
    showWelcome: true,
    // 照片墙相关状态
    showPhotoWall: false,
    photoWallImages: [], // 存储所有图片消息的引用
  }),

  getters: {
    // 获取当前对话的消息
    currentMessages: (state) => {
      return state.messages.filter(msg =>
        msg.conversationId === state.currentConversationId
      )
    },

    // 检查是否有消息
    hasMessages: (state) => {
      return state.messages.length > 0
    },

    // 获取所有图片消息
    imageMessages: (state) => {
      return state.messages.filter(msg => msg.type === 'image')
    },

    // 获取当前对话的图片消息
    currentImageMessages: (state) => {
      return state.messages.filter(msg =>
        msg.conversationId === state.currentConversationId && msg.type === 'image'
      )
    }
  },

  actions: {
    // 添加用户消息
    addUserMessage(content) {
      const message = {
        id: Date.now(),
        type: 'user',
        content: content.trim(),
        timestamp: new Date(),
        conversationId: this.currentConversationId || this.createNewConversation()
      }

      this.messages.push(message)
      this.showWelcome = false

      return message
    },

    // 添加图片消息
    addImageMessage(imageData, caption = '') {
      const message = {
        id: Date.now(),
        type: 'image',
        content: caption,
        imageUrl: imageData.url,
        imageFile: imageData.file,
        imageName: imageData.name,
        timestamp: new Date(),
        conversationId: this.currentConversationId || this.createNewConversation()
      }

      this.messages.push(message)
      this.showWelcome = false

      // 更新照片墙数据
      this.updatePhotoWall()

      return message
    },

    // 添加AI回复
    addAIMessage(content) {
      const message = {
        id: Date.now() + 1,
        type: 'ai',
        content: content,
        timestamp: new Date(),
        conversationId: this.currentConversationId
      }

      this.messages.push(message)
      return message
    },

    // 创建新对话
    createNewConversation() {
      const conversationId = 'conv_' + Date.now()
      this.currentConversationId = conversationId
      this.showWelcome = true
      this.isLoading = false
      return conversationId
    },

    // 设置加载状态
    setLoading(loading) {
      this.isLoading = loading
    },

    // 切换欢迎页面显示
    setShowWelcome(show) {
      this.showWelcome = show
    },

    // 清空当前对话
    clearCurrentConversation() {
      if (this.currentConversationId) {
        this.messages = this.messages.filter(msg =>
          msg.conversationId !== this.currentConversationId
        )
      }
      this.showWelcome = true
      this.updatePhotoWall()
    },

    // 切换照片墙显示状态
    togglePhotoWall() {
      this.showPhotoWall = !this.showPhotoWall
    },

    // 更新照片墙数据
    updatePhotoWall() {
      this.photoWallImages = this.messages
        .filter(msg => msg.type === 'image')
        .map(msg => ({
          id: msg.id,
          url: msg.imageUrl,
          name: msg.imageName,
          timestamp: msg.timestamp,
          conversationId: msg.conversationId,
          messageId: msg.id
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },

    // 定位到指定消息
    scrollToMessage(messageId) {
      // 这个方法会被组件调用来滚动到指定消息
      const message = this.messages.find(msg => msg.id === messageId)
      if (message) {
        // 如果消息不在当前对话中，切换到对应对话
        if (message.conversationId !== this.currentConversationId) {
          this.currentConversationId = message.conversationId
          this.showWelcome = false
        }
        return message
      }
      return null
    },


  }
})
