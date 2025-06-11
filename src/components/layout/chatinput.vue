<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { useChatStore } from '@/stores/baseStore'

// 接收父组件传递的侧边栏状态
const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

// 使用聊天store
const chatStore = useChatStore()

// 计算属性 - 监听照片墙状态
const showPhotoWall = computed(() => chatStore.showPhotoWall)

// 响应式数据
const message = ref('')
const textareaRef = ref(null)
const deepThinkActive = ref(false)
const webSearchActive = ref(false)
const fileInputRef = ref(null)
const attachedImages = ref([]) // 存储待发送的图片

// 滚动到底部的方法
const scrollToBottomImmediate = () => {
  nextTick(() => {
    const chatMessagesContainer = document.querySelector('.chat-messages')
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
      console.log('输入框触发滚动到底部')
    }
  })
}

// 方法
const handleSend = async () => {
  if ((!message.value.trim() && attachedImages.value.length === 0) || chatStore.isLoading) return

  const userMessage = message.value.trim()

  // 先发送图片消息
  if (attachedImages.value.length > 0) {
    attachedImages.value.forEach(imageData => {
      chatStore.addImageMessage(imageData, userMessage)
    })
    // 清空附件
    attachedImages.value = []
  } else if (userMessage) {
    // 发送文本消息
    console.log('发送消息:', userMessage)
    chatStore.addUserMessage(userMessage)
  }

  // 确保不再显示欢迎页面
  chatStore.setShowWelcome(false)

  // 立即滚动到底部（用户消息）
  nextTick(() => {
    scrollToBottomImmediate()
  })

  // 清空输入框
  message.value = ''

  // 重置textarea高度到初始状态
  resetTextareaHeight()

  // 设置加载状态
  chatStore.setLoading(true)

  try {
    // 模拟AI回复
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 添加AI回复
    const aiResponse = generateAIResponse(userMessage || '我看到了您分享的图片')
    chatStore.addAIMessage(aiResponse)

    // AI回复后也滚动到底部
    nextTick(() => {
      scrollToBottomImmediate()
    })

    console.log('消息发送成功')
  } catch (error) {
    console.error('发送消息失败:', error)
    // 可以添加错误消息到聊天
    chatStore.addAIMessage('抱歉，发生了错误，请稍后再试。')
  } finally {
    chatStore.setLoading(false)
  }
}

// 生成AI回复的简单逻辑
const generateAIResponse = (userMessage) => {
  const responses = [
    '你好！我是Dolphin AI，很高兴为您服务。有什么我可以帮助您的吗？',
    '我理解您的问题。让我为您详细解答...',
    '这是一个很好的问题！根据我的理解...',
    '感谢您的提问。基于您提供的信息...',
    '我来帮您分析一下这个问题...'
  ]

  // 简单的关键词匹配
  if (userMessage.includes('你好') || userMessage.includes('hello')) {
    return '你好！我是Dolphin AI，很高兴认识您！有什么我可以帮助您的吗？'
  } else if (userMessage.includes('谢谢') || userMessage.includes('感谢')) {
    return '不客气！如果您还有其他问题，随时可以问我。'
  } else if (userMessage.includes('再见') || userMessage.includes('拜拜')) {
    return '再见！期待下次为您服务。'
  } else {
    // 随机选择一个回复
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

const handleKeydown = (event) => {
  // Enter 发送消息 (不需要Ctrl)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

// 处理剪贴板粘贴
const handlePaste = (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.startsWith('image/')) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        addImageToAttachments(file)
      }
    }
  }
}

const handleAttachment = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        addImageToAttachments(file)
      }
    })
  }
  // 清空input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const addImageToAttachments = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageData = {
      url: e.target.result,
      file: file,
      name: file.name,
      id: Date.now() + Math.random() // 临时ID
    }
    attachedImages.value.push(imageData)
  }
  reader.readAsDataURL(file)
}

const removeAttachedImage = (imageId) => {
  attachedImages.value = attachedImages.value.filter(img => img.id !== imageId)
}

const handleWebSearch = () => {
  console.log('联网搜索')
  webSearchActive.value = !webSearchActive.value
  // 这里可以添加联网搜索逻辑
}

const handleDeepThink = () => {
  console.log('深度思考')
  deepThinkActive.value = !deepThinkActive.value
  // 这里可以添加深度思考逻辑
}

const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      const textarea = textareaRef.value
      // 重置高度以获取正确的scrollHeight
      textarea.style.height = 'auto'
      // 设置新高度，最小40px，最大120px
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 120)
      textarea.style.height = newHeight + 'px'
    }
  })
}

const resetTextareaHeight = () => {
  nextTick(() => {
    if (textareaRef.value) {
      const textarea = textareaRef.value
      // 重置到初始高度
      textarea.style.height = '40px'
    }
  })
}

// 组件挂载时初始化textarea高度
onMounted(() => {
  autoResize()
})
</script>

<template>
  <div class="chat-input-container" :class="{
    'sidebar-collapsed': sidebarCollapsed,
    'with-photo-wall': showPhotoWall
  }">
    <VContainer>
      <div class="input-wrapper">
        <div class="deepseek-input-card">
          <!-- 附件图片预览区域 -->
          <div v-if="attachedImages.length > 0" class="attached-images">
            <div
              v-for="image in attachedImages"
              :key="image.id"
              class="attached-image-item"
            >
              <img :src="image.url" :alt="image.name" class="attached-image-preview" />
              <div class="attached-image-overlay">
                <span class="attached-image-name">{{ image.name }}</span>
                <VBtn
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  color="white"
                  @click="removeAttachedImage(image.id)"
                />
              </div>
            </div>
          </div>

          <!-- 消息输入框区域 -->
          <div class="input-text-area">
            <textarea
              ref="textareaRef"
              v-model="message"
              :placeholder="attachedImages.length > 0 ? '添加描述（可选）...' : '给Dolphin AI 发送消息...'"
              class="message-input"
              rows="1"
              @keydown="handleKeydown"
              @input="autoResize"
              @paste="handlePaste"
            ></textarea>
          </div>

          <!-- 底部按钮行 -->
          <div class="bottom-actions">
            <!-- 深度思考按钮 -->
            <VBtn
              :variant="deepThinkActive ? 'flat' : 'outlined'"
              size="small"
              :class="['feature-btn', { 'feature-btn--active': deepThinkActive }]"
              @click="handleDeepThink"
            >
              <VIcon
                icon="mdi-head-lightbulb-outline"
                size="16"
                class="mr-1"
                :color="deepThinkActive ? 'white' : undefined"
              />
              深度思考 (R1)
            </VBtn>

            <!-- 联网搜索按钮 -->
            <VBtn
              :variant="webSearchActive ? 'flat' : 'outlined'"
              size="small"
              :class="['feature-btn', { 'feature-btn--active': webSearchActive }]"
              @click="handleWebSearch"
            >
              <VIcon
                icon="mdi-web"
                size="16"
                class="mr-1"
                :color="webSearchActive ? 'white' : undefined"
              />
              联网搜索
            </VBtn>

            <!-- 右侧按钮组 -->
            <div class="right-actions">
              <!-- 附件按钮 -->
              <VBtn
                icon
                variant="text"
                size="small"
                class="action-btn"
                @click="handleAttachment"
              >
                <VIcon
                  icon="mdi-paperclip"
                  size="20"
                  color="grey-darken-1"
                />
              </VBtn>

              <!-- 发送按钮 -->
              <VBtn
                :disabled="(!message.trim() && attachedImages.length === 0) || chatStore.isLoading"
                :loading="chatStore.isLoading"
                icon
                variant="text"
                size="small"
                class="send-btn"
                @click="handleSend"
              >
                <VIcon
                  icon="mdi-arrow-up"
                  size="20"
                  :color="(message.trim() || attachedImages.length > 0) && !chatStore.isLoading ? 'white' : 'grey-lighten-1'"
                />
              </VBtn>
            </div>
          </div>
        </div>
      </div>
    </VContainer>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<style scoped>
.chat-input-container {
  position: fixed;
  bottom: 0;
  left: 280px; /* 侧边栏展开时的宽度 */
  right: 0;
  background-color: rgb(var(--v-theme-surface));
  padding: 16px 0;
  z-index: 10;
  transition: left 0.3s ease, right 0.3s ease; /* 添加平滑过渡动画 */
}

/* 侧边栏收缩时的样式 */
.chat-input-container.sidebar-collapsed {
  left: 60px; /* 侧边栏收缩时的宽度 */
}

/* 照片墙打开时的样式 */
.chat-input-container.with-photo-wall {
  right: 320px; /* 照片墙的宽度 */
}

/* 同时有侧边栏收缩和照片墙打开的样式 */
.chat-input-container.sidebar-collapsed.with-photo-wall {
  left: 60px;
  right: 320px;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.deepseek-input-card {
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  background-color: #f6f8fa; /* 整个卡片使用浅灰色背景 */
  overflow: hidden;
  transition: all 0.2s ease;
}

.deepseek-input-card:hover {
  border-color: #d0d0d0;
  background-color: #f0f3f6; /* 悬停时稍微深一点 */
}

.deepseek-input-card:focus-within {
  border-color: #1976d2;
  background-color: #eef2f5; /* 聚焦时更深的背景色 */
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.input-text-area {
  padding: 16px 16px 8px 16px;
  display: flex;
  align-items: flex-end;
  min-height: 50px;
}

.bottom-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 16px 16px;
  gap: 8px;
}

.feature-btn {
  border-radius: 16px;
  text-transform: none;
  font-size: 14px;
  height: 32px;
  border-color: #e0e0e0;
  transition: all 0.2s ease;
  font-weight: 500; /* 默认状态稍微加粗 */
}

.feature-btn:hover {
  border-color: #d0d0d0;
  background-color: #f8f9fa;
}

.feature-btn--active {
  background-color: #1976d2 !important; /* 深蓝色背景 */
  border-color: #1976d2 !important;
  color: white !important; /* 白色文字 */
  font-weight: 600 !important; /* 加粗文字 */
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3) !important; /* 添加阴影 */
}

.feature-btn--active:hover {
  background-color: #1565c0 !important; /* 悬停时更深的蓝色 */
  border-color: #1565c0 !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4) !important; /* 更明显的阴影 */
  transform: translateY(-1px) !important; /* 轻微上移效果 */
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.action-btn {
  width: 32px;
  height: 32px;
  min-width: 32px;
}

.action-btn :deep(.v-btn__content) {
  opacity: 0.7;
}

.action-btn:hover :deep(.v-btn__content) {
  opacity: 1;
}

.message-input {
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  border: none;
  outline: none;
  background: transparent; /* 输入框背景透明，使用卡片背景 */
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  padding: 8px 0; /* 恢复原来的内边距 */
  margin: 0;
  resize: none;
  overflow-y: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-input::placeholder {
  color: #8c959f;
  font-size: 16px;
}

/* 美化滚动条 */
.message-input::-webkit-scrollbar {
  width: 4px;
}

.message-input::-webkit-scrollbar-track {
  background: transparent;
}

.message-input::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}

.message-input::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

/* 附件图片预览样式 */
.attached-images {
  display: flex;
  gap: 8px;
  padding: 12px 16px 8px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.attached-image-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: all 0.2s ease;
}

.attached-image-item:hover {
  border-color: #1976d2;
  transform: scale(1.02);
}

.attached-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attached-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.attached-image-item:hover .attached-image-overlay {
  opacity: 1;
}

.attached-image-name {
  color: white;
  font-size: 10px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attached-image-overlay .v-btn {
  align-self: flex-end;
}

.send-btn {
  width: 32px;
  height: 32px;
  min-width: 32px;
  background-color: #333;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.send-btn:hover {
  background-color: #555;
  transform: scale(1.05);
}

.send-btn:disabled {
  background-color: #f5f5f5;
  transform: none;
}

.send-btn:disabled:hover {
  background-color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-input-container {
    left: 0; /* 移动端时占满宽度 */
    right: 0; /* 移动端时照片墙不影响输入框 */
    padding: 12px 0;
  }

  /* 移动端照片墙打开时不改变输入框位置 */
  .chat-input-container.with-photo-wall {
    right: 0;
  }

  .input-text-area {
    padding: 12px 12px 6px 12px;
  }

  .bottom-actions {
    padding: 6px 12px 12px 12px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .feature-btn {
    font-size: 12px;
    height: 28px;
  }

  .message-input {
    font-size: 16px; /* 防止iOS缩放 */
  }
}
</style>
