<script setup>
import { ref } from 'vue'
import logoUrl from '@/assets/logo.png'

// 响应式数据
const aiAvatar = ref(logoUrl) // 使用Dolphin AI logo
const welcomeTitle = ref('我是 Dolphin AI，您的超声医疗助手！')

// 方法
const handleAvatarError = () => {
  // 如果logo加载失败，回退到机器人图标
  aiAvatar.value = null
  console.log('Logo加载失败，使用默认图标')
}
</script>

<template>
  <div class="welcome-section">
    <!-- AI头像 -->
    <div class="avatar-container">
      <div class="avatar-wrapper">
        <img
          v-if="aiAvatar"
          :src="aiAvatar"
          alt="Dolphin AI"
          class="ai-avatar"
          @error="handleAvatarError"
        >
        <VIcon
          v-else
          icon="mdi-robot-outline"
          size="50"
          color="primary"
          class="default-avatar"
        />
      </div>
    </div>

    <!-- 欢迎文字 -->
    <div class="welcome-content">
      <h1 class="welcome-title">
        {{ welcomeTitle }}
      </h1>
    </div>
  </div>
</template>

<style scoped>
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 24px;
  max-width: 600px;
  margin: 0 auto;
}

.avatar-container {
  margin-bottom: 16px;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(25, 118, 210, 0.4);
}

.ai-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.default-avatar {
  color: white;
}

.welcome-content {
  max-width: 600px;
}

.welcome-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0;
  line-height: 1.2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-section {
    padding: 16px 16px;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .avatar-wrapper {
    width: 70px;
    height: 70px;
  }

  .ai-avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
