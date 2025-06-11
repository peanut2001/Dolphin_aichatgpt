<script setup>
import { computed, ref, nextTick, watch, onMounted } from 'vue'
import { useChatStore } from '@/stores/baseStore'
import ChatMessage from './components/chatmessage.vue'
import PhotoWall from './components/PhotoWall.vue'

// 使用聊天store
const chatStore = useChatStore()

// 响应式数据
const chatContainer = ref(null)

// 计算属性
const chatMessages = computed(() => chatStore.currentMessages)
const showPhotoWall = computed(() => chatStore.showPhotoWall)
const hasImages = computed(() => chatStore.imageMessages.length > 0)

// 方法
const togglePhotoWall = () => {
  chatStore.togglePhotoWall()
}

// 测试功能：添加多条消息来测试滚动
const addTestMessages = () => {
  const testMessages = [
    '这是第一条测试消息',
    '这是第二条测试消息，内容稍微长一些，用来测试消息的显示效果',
    '第三条消息：测试自动滚动功能是否正常工作',
    '第四条消息：检查滚动条是否能够正确跟随最新消息',
    '第五条消息：这是最后一条测试消息，应该滚动到这里'
  ]

  testMessages.forEach((msg, index) => {
    setTimeout(() => {
      chatStore.addUserMessage(msg)
      // 模拟AI回复
      setTimeout(() => {
        chatStore.addAIMessage(`这是对"${msg}"的AI回复`)
      }, 500)
    }, index * 1000)
  })
}

// 滚动到底部的方法 - 修复版本
const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    // 使用聊天消息容器进行滚动，这是实际的滚动容器
    const chatMessagesContainer = chatContainer.value || document.querySelector('.chat-messages')
    if (chatMessagesContainer) {
      if (smooth) {
        chatMessagesContainer.scrollTo({
          top: chatMessagesContainer.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
      }
      console.log('滚动到底部 - 聊天消息区域', {
        scrollHeight: chatMessagesContainer.scrollHeight,
        clientHeight: chatMessagesContainer.clientHeight,
        scrollTop: chatMessagesContainer.scrollTop
      })
    }
  })
}

const handleScrollToMessage = async (messageId) => {
  await nextTick()
  const messageElement = document.getElementById(`message-${messageId}`)
  if (messageElement && chatContainer.value) {
    messageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
    // 添加高亮效果
    messageElement.classList.add('highlight')
    setTimeout(() => {
      messageElement.classList.remove('highlight')
    }, 2000)
  }
}

// 处理拖拽上传
const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

const handleDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            url: e.target.result,
            file: file,
            name: file.name
          }
          chatStore.addImageMessage(imageData, '')
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

// 监听消息变化，自动滚动到底部
watch(
  () => chatMessages.value.length,
  (newLength, oldLength) => {
    console.log('消息数量变化:', oldLength, '->', newLength)
    // 只有在消息数量增加时才滚动到底部
    if (newLength > oldLength) {
      console.log('检测到新消息，准备滚动到底部')
      // 使用nextTick确保DOM完全更新后再滚动
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
)

// 监听加载状态变化，AI回复完成后滚动到底部
watch(
  () => chatStore.isLoading,
  (isLoading, wasLoading) => {
    console.log('加载状态变化:', wasLoading, '->', isLoading)
    // 当加载状态从true变为false时（AI回复完成），滚动到底部
    if (wasLoading && !isLoading) {
      console.log('AI回复完成，准备滚动到底部')
      // 使用nextTick确保DOM完全更新后再滚动
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
)

// 监听消息数组的深度变化，确保任何消息更新都能触发滚动
watch(
  () => chatMessages.value,
  (newMessages, oldMessages) => {
    // 检查是否有新消息或消息内容发生变化
    if (newMessages && newMessages.length > 0) {
      const lastMessage = newMessages[newMessages.length - 1]
      const oldLastMessage = oldMessages && oldMessages.length > 0 ? oldMessages[oldMessages.length - 1] : null

      // 如果是新消息或最后一条消息的内容发生了变化，则滚动到底部
      if (!oldLastMessage || lastMessage.id !== oldLastMessage.id || lastMessage.content !== oldLastMessage.content) {
        console.log('检测到消息内容变化，准备滚动到底部')
        nextTick(() => {
          scrollToBottom()
        })
      }
    }
  },
  { deep: true }
)

// 组件挂载时，如果有消息则滚动到底部
onMounted(() => {
  if (chatMessages.value.length > 0) {
    // 使用非平滑滚动，立即定位到底部
    scrollToBottom(false)
  }
})
</script>

<template>
  <div class="chat-page" :class="{ 'with-photo-wall': showPhotoWall }">
    <!-- 右上角照片墙按钮 -->
    <VBtn
      :icon="showPhotoWall ? 'mdi-image-multiple' : 'mdi-image-multiple-outline'"
      size="small"
      variant="text"
      @click="togglePhotoWall"
      :disabled="!hasImages"
      :title="hasImages ? '照片墙' : '暂无图片'"
      class="photo-wall-btn"
    />

    <!-- 测试按钮（仅在没有消息时显示，临时放在左上角） -->
    <VBtn
      v-if="chatMessages.length === 0"
      variant="outlined"
      size="small"
      color="primary"
      @click="addTestMessages"
      class="test-btn"
    >
      添加测试消息
    </VBtn>

    <!-- 聊天消息区域 -->
    <div
      ref="chatContainer"
      class="chat-messages"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <VContainer>
        <div
          v-if="chatMessages.length === 0"
          class="empty-chat"
        >
          <div class="empty-content">
            <VIcon icon="mdi-message-outline" size="64" color="grey-lighten-1" />
            <p class="empty-text">开始新的对话</p>
            <p class="empty-hint">您可以拖拽图片到这里添加图片</p>
          </div>
        </div>

        <!-- 显示聊天消息 -->
        <div
          v-for="message in chatMessages"
          :key="message.id"
          class="message-item"
        >
          <ChatMessage :message="message" />
        </div>
      </VContainer>
    </div>

    <!-- 照片墙组件 -->
    <PhotoWall @scroll-to-message="handleScrollToMessage" />
  </div>
</template>

<style scoped>
.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: margin-right 0.3s ease;
}

.chat-page.with-photo-wall {
  margin-right: 320px;
}

/* 右上角照片墙按钮 */
.photo-wall-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.photo-wall-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 测试按钮（临时） */
.test-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1000;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  position: relative;
  /* 确保滚动区域不会延伸到输入框下方 */
  height: 100%;
  max-height: 100%;
}

/* 为聊天消息区域添加美化的滚动条 */
.chat-messages::-webkit-scrollbar {
  width: 10px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  transform: scale(1.05);
}

.chat-messages::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #4e5bc6 0%, #5e377e 100%);
  transform: scale(0.98);
}

.empty-chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-text {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.empty-hint {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.message-item {
  margin-bottom: 16px;
}

/* 消息高亮动画 */
.message-item.highlight {
  animation: highlight 2s ease-in-out;
}

@keyframes highlight {
  0% { background-color: transparent; }
  50% { background-color: rgba(25, 118, 210, 0.1); }
  100% { background-color: transparent; }
}

/* 拖拽区域样式 */
.chat-messages[data-dragging="true"] {
  background-color: rgba(25, 118, 210, 0.05);
  border: 2px dashed #1976d2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-page.with-photo-wall {
    margin-right: 0;
  }

  .chat-messages {
    padding: 8px 0;
  }

  /* 移动端滚动条更细 */
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  /* 移动端按钮位置调整 */
  .photo-wall-btn {
    top: 12px;
    right: 12px;
  }

  .test-btn {
    top: 12px;
    left: 12px;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕滚动条更细 */
  .chat-messages::-webkit-scrollbar {
    width: 4px;
  }
}
</style>
