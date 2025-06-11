<script setup>
import { ref } from "vue"
import { useAppStore } from "@/stores/baseStore"

// Props
const props = defineProps({
  dialogOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(["update:dialog-open", "close"])

// 状态管理
const appStore = useAppStore()

// 响应式数据
const activeTab = ref("general")

const settings = ref({
  theme: "light",
  language: "zh-CN",
  notifications: {
    email: true,
    push: false,
    sound: true,
  },
  privacy: {
    showOnlineStatus: true,
    allowDataCollection: false,
  },
})

// 选项卡配置
const tabs = [
  { value: "general", title: "通用设置", icon: "mdi-cog" },
  { value: "account", title: "账号管理", icon: "mdi-account-cog" },
  { value: "service", title: "服务协议", icon: "mdi-file-document" },
]

// 方法
const handleClose = () => {
  emit("update:dialog-open", false)
  emit("close")
}

const handleSave = () => {
  // 保存设置逻辑
  console.log("保存设置:", settings.value)
  // 这里可以调用API保存设置
}

const handleReset = () => {
  // 重置为默认设置
  settings.value = {
    theme: "light",
    language: "zh-CN",
    notifications: {
      email: true,
      push: false,
      sound: true,
    },
    privacy: {
      showOnlineStatus: true,
      allowDataCollection: false,
    },
  }
}
</script>

<template>
  <VDialog :model-value="dialogOpen" max-width="800" persistent>
    <VCard class="settings-dialog">
      <!-- 对话框头部 -->
      <VCardTitle class="dialog-header">
        <span class="dialog-title">系统设置</span>
        <VBtn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </VCardTitle>

      <!-- 选项卡导航 -->
      <VTabs v-model="activeTab" class="settings-tabs">
        <VTab v-for="tab in tabs" :key="tab.value" :value="tab.value" class="settings-tab">
          <VIcon :icon="tab.icon" class="mr-2" />
          {{ tab.title }}
        </VTab>
      </VTabs>

      <!-- 选项卡内容 -->
      <VCardText class="settings-content">
        <VTabsWindow v-model="activeTab">
          <!-- 通用设置 -->
          <VTabsWindowItem value="general">
            <div class="tab-content">
              <!-- 语言设置 -->
              <div class="setting-group">
                <h3 class="setting-title">语言</h3>
                <VSelect
                  v-model="settings.language"
                  :items="[
                    { title: '简体中文', value: 'zh-CN' },
                    { title: 'English', value: 'en-US' },
                    { title: '繁體中文', value: 'zh-TW' },
                  ]"
                  variant="outlined"
                  density="compact"
                  class="setting-select" />
              </div>

              <VDivider class="my-4" />

              <!-- 主题设置 -->
              <div class="setting-group">
                <h3 class="setting-title">主题</h3>
                <VSelect
                  v-model="settings.theme"
                  :items="[
                    { title: '跟随系统', value: 'auto' },
                    { title: '浅色主题', value: 'light' },
                    { title: '深色主题', value: 'dark' },
                  ]"
                  variant="outlined"
                  density="compact"
                  class="setting-select" />
              </div>
            </div>
          </VTabsWindowItem>

          <!-- 账号管理 -->
          <VTabsWindowItem value="account">
            <div class="tab-content">
              <div class="account-info">
                <h3 class="setting-title">账号信息</h3>
                <div class="info-item">
                  <span class="info-label">用户名：</span>
                  <span class="info-value">admin</span>
                </div>
                <div class="info-item">
                  <span class="info-label">邮箱：</span>
                  <span class="info-value">admin@example.com</span>
                </div>
                <div class="info-item">
                  <span class="info-label">注册时间：</span>
                  <span class="info-value">2024-01-01</span>
                </div>
              </div>

              <VDivider class="my-4" />

              <div class="account-actions">
                <h3 class="setting-title">账号操作</h3>
                <VBtn variant="outlined" class="mb-2 mr-2">修改密码</VBtn>
                <VBtn variant="outlined" class="mb-2 mr-2">绑定邮箱</VBtn>
                <VBtn variant="outlined" color="error" class="mb-2">注销账号</VBtn>
              </div>
            </div>
          </VTabsWindowItem>

          <!-- 服务协议 -->
          <VTabsWindowItem value="service">
            <div class="tab-content">
              <div class="service-content">
                <h3 class="setting-title">用户协议</h3>
                <div class="agreement-text">
                  <p>欢迎使用 Dolphin AI 服务。在使用我们的服务之前，请仔细阅读以下用户协议：</p>
                  <p>1. 服务条款：用户在使用本服务时，应遵守相关法律法规...</p>
                  <p>2. 隐私政策：我们重视用户隐私，承诺保护用户个人信息...</p>
                  <p>3. 免责声明：本服务仅供参考，不构成专业建议...</p>
                </div>

                <VDivider class="my-4" />

                <h3 class="setting-title">隐私政策</h3>
                <div class="agreement-text">
                  <p>我们收集和使用您的个人信息仅用于提供更好的服务体验...</p>
                  <p>您的数据将被安全存储，不会与第三方共享...</p>
                </div>
              </div>
            </div>
          </VTabsWindowItem>
        </VTabsWindow>
      </VCardText>

      <!-- 对话框底部按钮 -->
      <VCardActions class="dialog-actions">
        <VSpacer />
        <VBtn variant="outlined" @click="handleReset">重置默认</VBtn>
        <VBtn color="primary" @click="handleSave">保存设置</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.settings-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.settings-tabs {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.settings-tab {
  text-transform: none;
  font-weight: 500;
}

.settings-content {
  padding: 24px;
  min-height: 400px;
}

.tab-content {
  max-width: 600px;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.setting-select {
  max-width: 300px;
}

.account-info {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.info-value {
  color: #333;
}

.account-actions {
  margin-bottom: 24px;
}

.service-content {
  max-height: 350px;
  overflow-y: auto;
}

.agreement-text {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.agreement-text p {
  margin-bottom: 12px;
}

.dialog-actions {
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}
</style>
