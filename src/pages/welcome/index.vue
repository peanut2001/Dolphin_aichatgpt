<script setup>
import { useChatStore } from "@/stores/baseStore"
import WelcomeSection from "./components/welcomesection.vue"
import FeatureCards from "./components/featurecards.vue"

// 使用聊天store
const chatStore = useChatStore()

// 方法
const handleStartChat = () => {
  chatStore.setShowWelcome(false)
  console.log("开始聊天")
}
</script>

<template>
  <div class="welcome-page">
    <WelcomeSection />
    <FeatureCards @feature-click="handleStartChat" />
  </div>
</template>

<style scoped>
.welcome-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 140px 24px 24px 24px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-page {
    padding: 80px 16px 16px 16px;
  }
}
</style>
