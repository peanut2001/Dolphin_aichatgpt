<script setup>
import { computed, ref } from 'vue'

// 接收消息数据
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

// 响应式数据
const showImageDialog = ref(false)

// 计算属性
const isUser = computed(() => props.message.type === 'user')
const isAI = computed(() => props.message.type === 'ai')
const isImage = computed(() => props.message.type === 'image')

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 图片相关方法
const openImagePreview = () => {
  showImageDialog.value = true
}

const closeImagePreview = () => {
  showImageDialog.value = false
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.png'
  console.warn('图片加载失败:', event.target.src)
}

const downloadImage = () => {
  if (props.message.imageUrl) {
    const link = document.createElement('a')
    link.href = props.message.imageUrl
    link.download = props.message.imageName || 'image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<template>
  <div class="message-container" :class="{ 'user-message': isUser, 'ai-message': isAI, 'image-message': isImage }" :id="`message-${message.id}`">
    <div class="message-wrapper">
      <!-- AI消息的头像和标识 -->
      <div v-if="isAI" class="message-avatar">
        <div class="ai-avatar">
          <VIcon icon="mdi-robot-outline" size="20" color="white" />
        </div>
      </div>

      <!-- 图片消息的头像 -->
      <div v-if="isImage" class="message-avatar">
        <div class="user-avatar">
          <VIcon icon="mdi-image" size="20" color="white" />
        </div>
      </div>

      <!-- 消息内容 -->
      <div class="message-content">
        <!-- 图片消息内容 -->
        <div v-if="isImage" class="image-content">
          <div class="image-container">
            <img
              :src="message.imageUrl"
              :alt="message.imageName || '图片'"
              class="message-image"
              @click="openImagePreview"
              @error="handleImageError"
            />
            <div class="image-overlay">
              <VBtn
                icon="mdi-fullscreen-exit"
                size="small"
                variant="text"
                color="white"
                @click="openImagePreview"
              />
            </div>
          </div>
          <div v-if="message.content" class="image-caption">
            {{ message.content }}
          </div>
        </div>

        <!-- 文本消息内容 -->
        <div v-else class="message-text">
          {{ message.content }}
        </div>

        <!-- 消息时间和操作 -->
        <div class="message-footer">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>

          <!-- AI消息的操作按钮 -->
          <div v-if="isAI" class="message-actions">
            <VBtn
              icon="mdi-content-copy"
              size="x-small"
              variant="text"
              @click="copyMessage"
            />
            <VBtn
              icon="mdi-refresh"
              size="x-small"
              variant="text"
              @click="regenerateMessage"
            />
            <VBtn
              icon="mdi-thumb-up-outline"
              size="x-small"
              variant="text"
              @click="likeMessage"
            />
            <VBtn
              icon="mdi-thumb-down-outline"
              size="x-small"
              variant="text"
              @click="dislikeMessage"
            />
          </div>

          <!-- 图片消息的操作按钮 -->
          <div v-if="isImage" class="message-actions">
            <VBtn
              icon="mdi-download-outline"
              size="x-small"
              variant="text"
              @click="downloadImage"
            />
            <VBtn
              icon="mdi-fullscreen-exit"
              size="x-small"
              variant="text"
              @click="openImagePreview"
            />
          </div>
        </div>
      </div>

      <!-- 用户消息的头像 -->
      <div v-if="isUser && !isImage" class="message-avatar">
        <div class="user-avatar">
          <VIcon icon="mdi-account-outline" size="20" color="white" />
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <VDialog
      v-model="showImageDialog"
      max-width="800"
      @click:outside="closeImagePreview"
    >
      <VCard v-if="isImage">
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>{{ message.imageName || '图片预览' }}</span>
          <VBtn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="closeImagePreview"
          />
        </VCardTitle>
        <VCardText class="pa-0">
          <img
            :src="message.imageUrl"
            :alt="message.imageName"
            class="preview-image"
          />
        </VCardText>
        <VCardActions>
          <VBtn
            prepend-icon="mdi-download"
            variant="outlined"
            @click="downloadImage"
          >
            下载
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
export default {
  methods: {
    copyMessage() {
      navigator.clipboard.writeText(this.message.content)
      console.log('消息已复制')
    },
    regenerateMessage() {
      console.log('重新生成消息')
      // 这里可以添加重新生成消息的逻辑
    },
    likeMessage() {
      console.log('点赞消息')
      // 这里可以添加点赞逻辑
    },
    dislikeMessage() {
      console.log('点踩消息')
      // 这里可以添加点踩逻辑
    }
  }
}
</script>

<style scoped>
.message-container {
  margin-bottom: 24px;
  width: 100%;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

/* AI消息样式 */
.ai-message .message-wrapper {
  justify-content: flex-start;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 用户消息样式 */
.user-message .message-wrapper {
  justify-content: flex-end;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4caf50, #81c784);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 消息内容 */
.message-content {
  max-width: 70%;
  min-width: 100px;
}

.ai-message .message-content {
  background-color: #f5f5f5;
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
}

.user-message .message-content {
  background-color: #1976d2;
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  margin-bottom: 8px;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.ai-message .message-time {
  color: rgba(0, 0, 0, 0.6);
}

.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-container:hover .message-actions {
  opacity: 1;
}

/* 图片消息样式 */
.image-message .message-wrapper {
  justify-content: flex-end;
}

.image-content {
  max-width: 300px;
}

.image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 8px;
}

.message-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;
}

.image-container:hover .message-image {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.image-caption {
  font-size: 14px;
  color: #666;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 12px;
  margin-top: 4px;
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-wrapper {
    padding: 0 8px;
  }

  .message-content {
    max-width: 85%;
  }

  .message-actions {
    opacity: 1;
  }

  .image-content {
    max-width: 250px;
  }

  .message-image {
    max-height: 200px;
  }
}
</style>
