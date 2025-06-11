<script setup>
import { ref } from "vue"
import Sidebar from "@/components/layout/sidebar.vue"
import MainContent from "@/components/layout/maincontent.vue"
import ChatInput from "@/components/layout/chatinput.vue"

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 处理侧边栏切换
const handleSidebarToggle = (isCollapsed) => {
  sidebarCollapsed.value = isCollapsed
  console.log("侧边栏状态变化:", isCollapsed ? "收缩" : "展开")
}
</script>

<template>
  <VApp>
    <!-- 主体布局 -->
    <VMain>
      <div class="app-layout">
        <!-- 左侧边栏 -->
        <Sidebar @sidebar-toggle="handleSidebarToggle" />

        <!-- 主内容区域 -->
        <div class="content-area">
          <MainContent />
          <ChatInput :sidebar-collapsed="sidebarCollapsed" />
        </div>
      </div>
    </VMain>
  </VApp>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* 防止外层滚动条 */
}

.content-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden; /* 防止外层滚动条 */
  /* 移除min-height，使用固定height */
}

/* 响应式设计 */
/* 移动端样式已在各个组件中单独处理 */
</style>
