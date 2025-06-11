<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authstore'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/logo.png'
import UserMenu from './usermenu.vue'

// 状态管理
const authStore = useAuthStore()
const router = useRouter()

// 响应式数据
const userMenuOpen = ref(false)
</script>

<template>
  <VAppBar
    color="primary"
    density="compact"
    elevation="1"
  >
    <!-- 左侧品牌标识 -->
    <VAppBarTitle class="d-flex align-center">
      <img
        :src="logoUrl"
        alt="Dolphin AI Logo"
        class="logo-image mr-2"
      />
      <span class="text-h6 font-weight-bold">Dolphin AI</span>
    </VAppBarTitle>

    <VSpacer />

    <!-- 右侧用户菜单 -->
    <UserMenu />
  </VAppBar>
</template>

<style scoped>
.v-app-bar-title {
  color: white;
}

.logo-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
