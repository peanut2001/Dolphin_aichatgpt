<script setup>
import { computed, ref } from 'vue'
import { useChatStore } from '@/stores/baseStore'

const chatStore = useChatStore()

// 计算属性
const photoWallImages = computed(() => chatStore.photoWallImages)
const showPhotoWall = computed(() => chatStore.showPhotoWall)

// 响应式数据
const selectedImage = ref(null)
const showImageDialog = ref(false)

// 方法
const handleImageClick = (image) => {
  // 定位到对应的消息
  const message = chatStore.scrollToMessage(image.messageId)
  if (message) {
    // 触发滚动事件
    emit('scrollToMessage', image.messageId)
  }
}

const openImagePreview = (image) => {
  selectedImage.value = image
  showImageDialog.value = true
}

const closeImagePreview = () => {
  showImageDialog.value = false
  selectedImage.value = null
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 定义事件
const emit = defineEmits(['scrollToMessage'])
</script>

<template>
  <div class="photo-wall" :class="{ 'show': showPhotoWall }">
    <!-- 照片墙头部 -->
    <div class="photo-wall-header">
      <div class="header-title">
        <VIcon icon="mdi-image-multiple-outline" size="20" />
        <span>照片墙</span>
        <VChip size="x-small" color="primary">{{ photoWallImages.length }}</VChip>
      </div>
      <VBtn
        icon="mdi-close"
        size="small"
        variant="text"
        @click="chatStore.togglePhotoWall()"
      />
    </div>

    <!-- 照片网格 -->
    <div class="photo-grid" v-if="photoWallImages.length > 0">
      <div
        v-for="image in photoWallImages"
        :key="image.id"
        class="photo-item"
        @click="handleImageClick(image)"
      >
        <div class="photo-container">
          <img
            :src="image.url"
            :alt="image.name"
            class="photo-thumbnail"
            @error="handleImageError"
          />
          <div class="photo-overlay">
            <div class="photo-date">{{ formatDate(image.timestamp) }}</div>
            <div class="photo-actions">
              <VBtn
                icon="mdi-eye-outline"
                size="x-small"
                variant="text"
                color="white"
                @click.stop="openImagePreview(image)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <VIcon icon="mdi-image-off-outline" size="48" color="grey-lighten-1" />
      <p class="empty-text">还没有图片</p>
    </div>

    <!-- 图片预览对话框 -->
    <VDialog
      v-model="showImageDialog"
      max-width="800"
      @click:outside="closeImagePreview"
    >
      <VCard v-if="selectedImage">
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>{{ selectedImage.name || '图片预览' }}</span>
          <VBtn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="closeImagePreview"
          />
        </VCardTitle>
        <VCardText class="pa-0">
          <img
            :src="selectedImage.url"
            :alt="selectedImage.name"
            class="preview-image"
          />
        </VCardText>
        <VCardActions>
          <VBtn
            prepend-icon="mdi-map-marker-outline"
            variant="outlined"
            @click="handleImageClick(selectedImage); closeImagePreview()"
          >
            定位到对话
          </VBtn>
          <VSpacer />
          <VBtn
            prepend-icon="mdi-download-outline"
            variant="outlined"
            @click="downloadImage(selectedImage)"
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
    handleImageError(event) {
      event.target.src = '/placeholder-image.png' // 可以设置一个占位图
      console.warn('图片加载失败:', event.target.src)
    },
    
    downloadImage(image) {
      const link = document.createElement('a')
      link.href = image.url
      link.download = image.name || 'image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.photo-wall {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.photo-wall.show {
  right: 0;
}

.photo-wall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.photo-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.photo-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.photo-item:hover {
  transform: scale(1.02);
}

.photo-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.photo-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.photo-item:hover .photo-thumbnail {
  transform: scale(1.1);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.5) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-date {
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.photo-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  text-align: center;
}

.empty-text {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: contain;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .photo-wall {
    width: 100vw;
    right: -100vw;
  }
  
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 12px;
  }
}
</style>
