<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import logoUrl from "@/assets/logo.png"

// 定义emits
const emit = defineEmits(["sidebar-toggle"])

// 路由
const router = useRouter()

// 响应式数据
const isCollapsed = ref(false) // 侧边栏收缩状态

const conversations = ref([
  {
    id: 1,
    title: "今天",
    description: "用户输入重复文字",
    date: new Date(),
    category: "今天",
  },
  {
    id: 2,
    title: "昨天",
    description: "Greeting and Offer of Assistance",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: "昨天",
  },
  {
    id: 3,
    title: "7天内",
    description: "无法查看图片请描述您的问题",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: "7天内",
  },
  {
    id: 4,
    title: "2025-04",
    description: "import { ref } from 'vue' import",
    date: new Date("2025-04-15"),
    category: "2025-04",
  },
  {
    id: 5,
    title: "Vue组件间通信实现方案",
    description: "前端开发Windsur使用规则制定",
    date: new Date("2025-04-10"),
    category: "2025-04",
  },
  {
    id: 6,
    title: "防止与污染保护及交叉观察",
    description: "",
    date: new Date("2025-04-08"),
    category: "2025-04",
  },
  {
    id: 7,
    title: "2025-03",
    description: "前端开发者如何回答3D打印业面试",
    date: new Date("2025-03-20"),
    category: "2025-03",
  },
  {
    id: 8,
    title: "Fabric裁剪功能实现示例",
    description: "删除图片后索引超出问题修复",
    date: new Date("2025-03-15"),
    category: "2025-03",
  },
  {
    id: 9,
    title: "TSX的含义及用途解析",
    description: "",
    date: new Date("2025-03-10"),
    category: "2025-03",
  },
])

const activeConversation = ref(null)

// 计算属性 - 按日期分组对话
const groupedConversations = computed(() => {
  const groups = {}
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  conversations.value.forEach((conv) => {
    const convDate = new Date(conv.date)
    const convDateOnly = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate())

    let category
    if (convDateOnly.getTime() === today.getTime()) {
      category = "今天"
    } else if (convDateOnly.getTime() === yesterday.getTime()) {
      category = "昨天"
    } else if (convDateOnly >= sevenDaysAgo) {
      category = "7天内"
    } else {
      // 使用年月格式
      category = `${convDate.getFullYear()}-${String(convDate.getMonth() + 1).padStart(2, "0")}`
    }

    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(conv)
  })

  // 按时间顺序排序分组
  const sortedGroups = {}
  const order = ["今天", "昨天", "7天内"]

  // 先添加固定顺序的分组
  order.forEach((key) => {
    if (groups[key]) {
      sortedGroups[key] = groups[key]
    }
  })

  // 再添加年月分组，按时间倒序
  Object.keys(groups)
    .filter((key) => !order.includes(key))
    .sort((a, b) => b.localeCompare(a))
    .forEach((key) => {
      sortedGroups[key] = groups[key]
    })

  return sortedGroups
})

// 计算属性 - 扁平化的对话列表，用于只显示一次时间标签
const flatConversations = computed(() => {
  const result = []
  const groups = groupedConversations.value
  const shownCategories = new Set()

  Object.keys(groups).forEach((category) => {
    const convs = groups[category]
    convs.forEach((conv, index) => {
      // 只在该分类第一次出现时显示时间标签
      const showCategoryHeader = !shownCategories.has(category) && index === 0

      if (showCategoryHeader) {
        shownCategories.add(category)
      }

      result.push({
        ...conv,
        category,
        showCategoryHeader,
      })
    })
  })

  return result
})

// 导入聊天store
import { useChatStore } from "@/stores/baseStore"

// 使用聊天store
const chatStore = useChatStore()

// 方法
const createNewChat = () => {
  console.log("创建新对话")
  chatStore.createNewConversation()
}

const selectConversation = (conversation) => {
  activeConversation.value = conversation.id
  console.log("选择对话:", conversation.title)
}

// 添加用户菜单状态
const userMenuOpen = ref(false)
const settingsDialogOpen = ref(false)
const activeSettingsTab = ref("general")

// 导入认证store
import { useAuthStore } from "@/stores/authstore"

const authStore = useAuthStore()

const openMobileApp = () => {
  console.log("打开移动端应用")
}

const openProfile = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const openSettings = () => {
  userMenuOpen.value = false
  settingsDialogOpen.value = true
}

const openContact = () => {
  userMenuOpen.value = false
  router.push({ name: "contactus" })
}

const handleLogout = () => {
  userMenuOpen.value = false
  authStore.logout()
  router.push({ name: "login" })
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit("sidebar-toggle", isCollapsed.value)
  console.log("切换侧边栏状态:", isCollapsed.value ? "收缩" : "展开")
}

const handleLogoClick = () => {
  console.log("点击logo")
  // 可以添加跳转到首页或其他功能
  // router.push({ name: "home" })
}
</script>

<template>
  <VNavigationDrawer
    :model-value="true"
    :width="isCollapsed ? 60 : 280"
    class="sidebar"
    :class="{ 'sidebar-collapsed': isCollapsed }"
    permanent>
    <div class="sidebar-content">
      <!-- 品牌标识区域 -->
      <div class="brand-section">
        <!-- 展开状态的品牌头部 -->
        <div v-if="!isCollapsed" class="brand-header">
          <div class="brand-content">
            <div class="logo-container" @click="handleLogoClick">
              <img :src="logoUrl" alt="Dolphin AI Logo" class="brand-logo" />
            </div>
            <div class="brand-info">
              <h2 class="brand-name">Dolphin AI</h2>
              <p class="brand-subtitle">医疗AI助手</p>
            </div>
          </div>

          <!-- 收缩按钮 -->
          <VBtn
            variant="text"
            size="default"
            icon="mdi-home"
            class="collapse-btn"
            @click="toggleSidebar" />
        </div>

        <!-- 收缩状态下的logo和展开按钮 -->
        <div v-if="isCollapsed" class="collapsed-header">
          <VBtn
            variant="text"
            size="default"
            icon="mdi-home-outline"
            class="expand-btn"
            @click="toggleSidebar" />
          <div class="collapsed-logo-container" @click="handleLogoClick">
            <img :src="logoUrl" alt="Dolphin AI Logo" class="collapsed-logo" />
          </div>
        </div>

        <!-- 新对话按钮区域 -->
        <div class="new-chat-section">
          <!-- 展开状态的新对话按钮 -->
          <VBtn
            v-if="!isCollapsed"
            color="primary"
            variant="flat"
            size="default"
            prepend-icon="mdi-plus-circle"
            class="new-chat-button"
            @click="createNewChat">
            开启新对话
          </VBtn>

          <!-- 收缩状态下的新对话按钮 -->
          <VBtn
            v-if="isCollapsed"
            variant="text"
            size="default"
            icon="mdi-plus"
            class="collapsed-new-chat-btn"
            @click="createNewChat" />
        </div>
      </div>

      <VDivider v-if="!isCollapsed" />

      <!-- 对话历史 -->
      <div v-if="!isCollapsed" class="conversation-history">
        <div class="conversation-list">
          <template v-for="conversation in flatConversations" :key="conversation.id">
            <!-- 对话项目 -->
            <div
              class="conversation-item"
              :class="{ active: activeConversation === conversation.id }"
              @click="selectConversation(conversation)">
              <div class="conversation-title">{{ conversation.title }}</div>
              <div v-if="conversation.description" class="conversation-description">
                {{ conversation.description }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 底部菜单 -->
      <div class="bottom-menu">
        <VDivider v-if="!isCollapsed" />

        <!-- 展开状态的底部菜单 -->
        <VList v-if="!isCollapsed" density="compact">
          <VListItem prepend-icon="mdi-cellphone" title="移动端 App" @click="openMobileApp">
            <template #append>
              <VChip color="success" size="x-small" variant="flat"> 新版 </VChip>
            </template>
          </VListItem>

          <!-- 个人资料菜单 -->
          <VMenu
            v-model="userMenuOpen"
            :close-on-content-click="false"
            location="top end"
            offset="8">
            <template #activator="{ props }">
              <VListItem
                v-bind="props"
                prepend-icon="mdi-account"
                title="个人资料"
                :append-icon="userMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </template>

            <VCard min-width="200" class="user-menu-card">
              <!-- 菜单项 -->
              <VList density="compact" class="user-menu-list">
                <VListItem
                  prepend-icon="mdi-cog-outline"
                  title="系统设置"
                  class="menu-item"
                  @click="openSettings" />
                <VListItem
                  prepend-icon="mdi-email-outline"
                  title="联系我们"
                  class="menu-item"
                  @click="openContact" />
                <VListItem
                  prepend-icon="mdi-logout"
                  title="退出登录"
                  class="menu-item"
                  @click="handleLogout" />
              </VList>
            </VCard>
          </VMenu>
        </VList>

        <!-- 收缩状态的底部菜单 -->
        <div v-if="isCollapsed" class="collapsed-bottom-menu">
          <VBtn
            variant="text"
            size="default"
            icon="mdi-cellphone"
            class="collapsed-menu-btn"
            @click="openMobileApp" />

          <!-- 收缩状态的个人资料菜单 -->
          <VMenu
            v-model="userMenuOpen"
            :close-on-content-click="false"
            location="top end"
            offset="8">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                variant="text"
                size="default"
                icon="mdi-account"
                class="collapsed-menu-btn" />
            </template>

            <VCard min-width="200" class="user-menu-card">
              <!-- 菜单项 -->
              <VList density="compact" class="user-menu-list">
                <VListItem
                  prepend-icon="mdi-cog-outline"
                  title="系统设置"
                  class="menu-item"
                  @click="openSettings" />
                <VListItem
                  prepend-icon="mdi-email-outline"
                  title="联系我们"
                  class="menu-item"
                  @click="openContact" />
                <VListItem
                  prepend-icon="mdi-logout"
                  title="退出登录"
                  class="menu-item"
                  @click="handleLogout" />
              </VList>
            </VCard>
          </VMenu>
        </div>
      </div>
    </div>
  </VNavigationDrawer>

  <!-- 系统设置弹窗 - DeepSeek 风格 -->
  <VDialog v-model="settingsDialogOpen" max-width="600" persistent>
    <VCard class="deepseek-settings-dialog">
      <!-- 对话框头部 -->
      <div class="deepseek-header">
        <h2 class="deepseek-title">系统设置</h2>
        <VBtn
          icon="mdi-close"
          variant="text"
          size="small"
          class="close-btn"
          @click="settingsDialogOpen = false" />
      </div>

      <!-- 选项卡导航 -->
      <div class="deepseek-tabs">
        <div
          class="deepseek-tab"
          :class="{ active: activeSettingsTab === 'general' }"
          @click="activeSettingsTab = 'general'">
          通用设置
        </div>
        <div
          class="deepseek-tab"
          :class="{ active: activeSettingsTab === 'account' }"
          @click="activeSettingsTab = 'account'">
          账号管理
        </div>
        <div
          class="deepseek-tab"
          :class="{ active: activeSettingsTab === 'service' }"
          @click="activeSettingsTab = 'service'">
          服务协议
        </div>
      </div>

      <!-- 选项卡内容 -->
      <div class="deepseek-content">
        <!-- 通用设置 -->
        <div v-if="activeSettingsTab === 'general'" class="tab-panel">
          <!-- 语言设置 -->
          <div class="setting-row">
            <span class="setting-label">语言</span>
            <VSelect
              model-value="跟随系统"
              :items="['跟随系统', '简体中文', 'English', '繁體中文']"
              variant="outlined"
              density="compact"
              class="deepseek-select"
              hide-details />
          </div>

          <!-- 主题设置 -->
          <div class="setting-row">
            <span class="setting-label">主题</span>
            <VSelect
              model-value="跟随系统"
              :items="['跟随系统', '浅色主题', '深色主题']"
              variant="outlined"
              density="compact"
              class="deepseek-select"
              hide-details />
          </div>
        </div>

        <!-- 账号管理 -->
        <div v-if="activeSettingsTab === 'account'" class="tab-panel">
          <div class="account-section">
            <h3 class="section-title">账号信息</h3>
            <div class="info-row">
              <span class="info-label">用户名</span>
              <span class="info-value">admin</span>
            </div>
            <div class="info-row">
              <span class="info-label">邮箱</span>
              <span class="info-value">admin@example.com</span>
            </div>
            <div class="info-row">
              <span class="info-label">注册时间</span>
              <span class="info-value">2024-01-01</span>
            </div>
          </div>

          <div class="account-section">
            <h3 class="section-title">账号操作</h3>
            <div class="action-buttons">
              <VBtn variant="outlined" size="small" class="action-btn">修改密码</VBtn>
              <VBtn variant="outlined" size="small" class="action-btn">绑定邮箱</VBtn>
              <VBtn variant="outlined" color="error" size="small" class="action-btn">注销账号</VBtn>
            </div>
          </div>
        </div>

        <!-- 服务协议 -->
        <div v-if="activeSettingsTab === 'service'" class="tab-panel">
          <div class="service-section">
            <h3 class="section-title">用户协议</h3>
            <div class="agreement-content">
              <p>欢迎使用 Dolphin AI 服务。在使用我们的服务之前，请仔细阅读以下用户协议：</p>
              <p>1. 服务条款：用户在使用本服务时，应遵守相关法律法规</p>
              <p>2. 隐私政策：我们重视用户隐私，承诺保护用户个人信息</p>
              <p>3. 免责声明：本服务仅供参考，不构成专业建议</p>
            </div>
          </div>

          <div class="service-section">
            <h3 class="section-title">隐私政策</h3>
            <div class="agreement-content">
              <p>我们收集和使用您的个人信息仅用于提供更好的服务体验</p>
              <p>您的数据将被安全存储，不会与第三方共享</p>
            </div>
          </div>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>

<style scoped>
.sidebar {
  background-color: #f5f5f5 !important;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  transition: width 0.3s ease;
  overflow: hidden; /* 防止整个侧边栏出现滚动条 */
}

/* 侧边栏整体滚动条样式 - 使用全局样式基础上的定制 */
.sidebar ::-webkit-scrollbar {
  width: 6px;
}

.sidebar ::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.15) 100%);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar:hover ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.sidebar ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%);
  transform: scale(1.1);
}

.sidebar ::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.35) 100%);
  transform: scale(0.95);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
}

.brand-section {
  background-color: #f5f5f5;
  padding: 20px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.brand-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.brand-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-container:hover {
  transform: translateY(-2px) scale(1.05);
  background-color: rgba(25, 118, 210, 0.08);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.15);
}

.logo-container:active {
  transform: translateY(0) scale(1.02);
  transition: all 0.1s ease;
}

.brand-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
  font-weight: 500;
  opacity: 0.8;
}

.collapse-btn {
  color: #666 !important;
  opacity: 0.7;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.collapse-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.06);
  color: #333 !important;
}

.collapsed-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.expand-btn {
  color: #666 !important;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.expand-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.06);
  color: #333 !important;
}

.collapsed-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapsed-logo-container:hover {
  transform: translateY(-2px) scale(1.08);
  background-color: rgba(25, 118, 210, 0.08);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.15);
}

.collapsed-logo-container:active {
  transform: translateY(0) scale(1.04);
  transition: all 0.1s ease;
}

.collapsed-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.new-chat-section {
  width: 100%;
}

.new-chat-button {
  width: 100%;
  height: 44px;
  text-transform: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.25px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  transition: all 0.2s ease;
}

.new-chat-button:hover {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transform: translateY(-1px);
}

.collapsed-new-chat-btn {
  width: 100%;
  height: 36px;
  border-radius: 10px;
  color: #666 !important;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.collapsed-new-chat-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.06);
  color: #333 !important;
}

.collapsed-bottom-menu {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
}

.collapsed-menu-btn {
  width: 100%;
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.8;
}

.collapsed-menu-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.sidebar-collapsed {
  transition: width 0.3s ease;
}

.sidebar-collapsed .brand-section {
  padding: 16px 12px;
}

.conversation-history {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* 允许flex子项收缩 */
  padding: 8px 0;
  background-color: #f5f5f5;
}

/* 美化对话历史滚动条 - 精致设计 */
.conversation-history::-webkit-scrollbar {
  width: 6px;
}

.conversation-history::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.conversation-history::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.18) 100%);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.conversation-history::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.28) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.conversation-history::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.35) 100%);
  transform: scale(0.98);
}

/* 当侧边栏悬停时增强滚动条显示 */
.sidebar:hover .conversation-history::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 100%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* Firefox滚动条样式 */
.conversation-history {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

.conversation-group {
  margin-bottom: 24px;
}

.conversation-list {
  padding: 0 8px;
  background-color: #f5f5f5;
}

.conversation-item {
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background-color: transparent;
}

.conversation-item:hover {
  background-color: #eeeeee;
  border-color: #e0e0e0;
}

.conversation-item.active {
  background-color: #e3f2fd;
  border-color: #1976d2;
}

.conversation-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-description {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.conversation-item.active .conversation-title {
  color: #1976d2;
}

.conversation-item.active .conversation-description {
  color: #1976d2;
  opacity: 0.8;
}

.bottom-menu {
  flex-shrink: 0; /* 防止底部菜单被压缩 */
  margin-top: auto;
  background-color: #f5f5f5;
}

/* 底部菜单图标样式 */
.bottom-menu .v-list-item .v-icon {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.8;
}

.bottom-menu .v-list-item:hover .v-icon {
  opacity: 1;
}

/* 用户菜单样式 */
.user-menu-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
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

/* DeepSeek 风格系统设置弹窗样式 - 更加圆润现代 */
.deepseek-settings-dialog {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.deepseek-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-bottom: none;
}

.deepseek-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.02em;
}

.close-btn {
  color: #666 !important;
  opacity: 0.6;
  border-radius: 12px;
  width: 36px;
  height: 36px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.06);
  transform: scale(1.05);
}

.deepseek-tabs {
  display: flex;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  padding: 8px;
  gap: 4px;
}

.deepseek-tab {
  flex: 1;
  padding: 14px 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  background-color: transparent;
  position: relative;
  overflow: hidden;
}

.deepseek-tab::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.deepseek-tab:hover {
  color: #333;
  transform: translateY(-1px);
}

.deepseek-tab:hover::before {
  opacity: 1;
}

.deepseek-tab.active {
  color: #1976d2;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15), 0 2px 4px rgba(25, 118, 210, 0.1);
  font-weight: 700;
  transform: translateY(-2px);
}

.deepseek-content {
  padding: 28px 32px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  min-height: 320px;
}

.tab-panel {
  max-width: 100%;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.setting-row:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(25, 118, 210, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.setting-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  min-width: 80px;
  letter-spacing: -0.01em;
}

.deepseek-select {
  max-width: 200px;
  min-width: 150px;
  border-radius: 12px;
}

.account-section {
  margin-bottom: 28px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 20px 24px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.account-section:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 18px;
  letter-spacing: -0.02em;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.info-row:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(25, 118, 210, 0.1);
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.action-btn {
  text-transform: none;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-section {
  margin-bottom: 28px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  padding: 20px 24px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-section:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.agreement-content {
  font-size: 14px;
  line-height: 1.7;
  color: #555;
  max-height: 220px;
  overflow-y: auto;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.agreement-content p {
  margin-bottom: 14px;
  transition: color 0.2s ease;
}

.agreement-content p:hover {
  color: #333;
}

.agreement-content::-webkit-scrollbar {
  width: 6px;
}

.agreement-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.agreement-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.agreement-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.agreement-content::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #a0a0a0 0%, #808080 100%);
  transform: scale(0.98);
}

/* 移动端样式 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    z-index: 1000;
  }

  .sidebar-content {
    height: auto;
  }

  .conversation-history {
    display: none;
  }

  .bottom-menu {
    margin-top: 0;
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
  }

  .bottom-menu .v-list {
    display: flex;
    flex-direction: row;
    padding: 8px;
  }

  .bottom-menu .v-list-item {
    flex: 1;
    margin: 0 4px;
    text-align: center;
  }
}
</style>
