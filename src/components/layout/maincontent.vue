<script setup>
import { computed } from "vue"
import { useChatStore } from "@/stores/baseStore"
import WelcomePage from "@/pages/welcome/index.vue"
import ChatPage from "@/pages/chat/index.vue"

// 使用聊天store
const chatStore = useChatStore()

// 计算属性
const showWelcome = computed(() => {
  // 显示欢迎页面的条件：
  // 1. showWelcome为true，或者
  // 2. 当前对话没有消息
  return chatStore.showWelcome || chatStore.currentMessages.length === 0
})
</script>

<template>
  <div class="main-content">
    <!-- 欢迎页面 -->
    <WelcomePage v-if="showWelcome" />

    <!-- 聊天页面 -->
    <ChatPage v-else />
  </div>
</template>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 移除主内容区域的滚动条 */
  background-color: rgb(var(--v-theme-surface));
  /* 使用calc计算高度，减去输入框的高度（约140px，包含padding和内容） */
  height: calc(100vh - 140px);
  max-height: calc(100vh - 140px);
  position: relative;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    /* 移动端调整高度计算，减去较小的输入框高度（约80px） */
    height: calc(100vh - 80px);
    max-height: calc(100vh - 80px);
  }
}
</style>
