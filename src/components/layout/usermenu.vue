<script setup>
import { ref, computed } from "vue"
import { useAuthStore } from "@/stores/authstore"
import { useRouter } from "vue-router"

// 状态管理
const authStore = useAuthStore()
const router = useRouter()

// 响应式数据
const userMenuOpen = ref(false)

// 计算属性
const userEmail = computed(() => {
  // 从用户信息中获取邮箱，如果没有则显示默认邮箱
  return authStore.user?.email || "xia*******360@gmail.com"
})

const userName = computed(() => {
  return authStore.user?.name || "Dolphin AI"
})

// 方法
const handleLogout = () => {
  userMenuOpen.value = false
  authStore.logout()
  router.push({ name: "login" })
}

const handleProfile = () => {
  userMenuOpen.value = false
  router.push({ name: "userprofile" })
}

const handleSettings = () => {
  userMenuOpen.value = false
  router.push({ name: "usersettings" })
}

const handleContact = () => {
  userMenuOpen.value = false
  router.push({ name: "contactus" })
}
</script>

<template>
  <VMenu v-model="userMenuOpen" :close-on-content-click="false" location="bottom end" offset="8">
    <template #activator="{ props }">
      <VBtn v-bind="props" variant="text" color="white" class="text-none user-menu-trigger">
        <span class="mr-1">{{ userName }}</span>
        <VIcon :icon="userMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" />
      </VBtn>
    </template>

    <VCard min-width="240" class="user-menu-card">
      <!-- 用户信息头部 -->
      <div class="user-info-header">
        <div class="user-avatar">
          <VIcon icon="mdi-account-circle-outline" size="40" color="primary" />
        </div>
        <div class="user-details">
          <div class="user-email">{{ userEmail }}</div>
        </div>
      </div>

      <VDivider />

      <!-- 菜单项 -->
      <VList density="compact" class="user-menu-list">
        <VListItem
          prepend-icon="mdi-cog-outline"
          title="系统设置"
          class="menu-item"
          @click="handleSettings" />
        <VListItem
          prepend-icon="mdi-email-outline"
          title="联系我们"
          class="menu-item"
          @click="handleContact" />
        <VListItem
          prepend-icon="mdi-logout"
          title="退出登录"
          class="menu-item"
          @click="handleLogout" />
      </VList>
    </VCard>
  </VMenu>
</template>

<style scoped>
.user-menu-trigger {
  text-transform: none !important;
}

.user-menu-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.user-info-header {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-email {
  font-size: 14px;
  color: #666;
  word-break: break-all;
  line-height: 1.4;
}

.user-menu-list {
  padding: 8px 0;
}

.menu-item {
  padding: 8px 16px;
  min-height: 40px;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.menu-item .v-list-item__prepend {
  margin-right: 12px;
}

.menu-item .v-icon {
  color: #666;
}
</style>
