<template>
  <VApp>
    <VMain class="auth-main">
      <router-view />
    </VMain>
  </VApp>
</template>

<script setup>
// 简洁的认证布局，不包含导航栏和侧边栏
</script>

<style scoped>
.auth-main {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
