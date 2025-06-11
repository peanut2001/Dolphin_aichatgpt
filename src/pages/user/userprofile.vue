<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/baseStore'

// 状态管理
const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const dialogOpen = ref(false)
const isEditing = ref(false)
const loading = ref(false)

// 用户信息
const userInfo = reactive({
  avatar: '/api/placeholder/120/120',
  username: 'admin',
  email: 'admin@example.com',
  phone: '+86 138****8888',
  nickname: 'Dolphin AI 用户',
  bio: '这个人很懒，什么都没有留下...',
  location: '北京市',
  website: 'https://dolphin-ai.com',
  joinDate: '2024-01-01',
  lastLogin: '2024-01-15 14:30:00'
})

// 编辑表单数据
const editForm = reactive({
  nickname: '',
  bio: '',
  location: '',
  website: '',
  phone: ''
})

// 统计信息
const stats = reactive({
  totalChats: 156,
  totalMessages: 1234,
  favoriteTopics: ['AI技术', '编程', '产品设计'],
  membershipLevel: 'VIP'
})

// 监听路由变化，当进入用户资料页面时打开对话框
onMounted(() => {
  dialogOpen.value = true
  // 初始化编辑表单
  Object.assign(editForm, {
    nickname: userInfo.nickname,
    bio: userInfo.bio,
    location: userInfo.location,
    website: userInfo.website,
    phone: userInfo.phone
  })
})

// 方法
const handleClose = () => {
  dialogOpen.value = false
  setTimeout(() => {
    router.go(-1)
  }, 300) // 等待对话框关闭动画完成
}

const handleDialogUpdate = (value) => {
  dialogOpen.value = value
  if (!value) {
    setTimeout(() => {
      router.go(-1)
    }, 300)
  }
}

const startEdit = () => {
  isEditing.value = true
  // 重新同步编辑表单数据
  Object.assign(editForm, {
    nickname: userInfo.nickname,
    bio: userInfo.bio,
    location: userInfo.location,
    website: userInfo.website,
    phone: userInfo.phone
  })
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveProfile = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户信息
    Object.assign(userInfo, {
      nickname: editForm.nickname,
      bio: editForm.bio,
      location: editForm.location,
      website: editForm.website,
      phone: editForm.phone
    })
    
    isEditing.value = false
    console.log('用户资料已保存:', editForm)
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAvatarUpload = () => {
  // 头像上传逻辑
  console.log('上传头像')
}
</script>

<template>
  <div class="profile-page">
    <VDialog :model-value="dialogOpen" max-width="900" persistent>
      <VCard class="profile-dialog">
        <!-- 对话框头部 -->
        <VCardTitle class="dialog-header">
          <span class="dialog-title">用户资料</span>
          <VBtn icon="mdi-close" variant="text" size="small" @click="handleClose" />
        </VCardTitle>

        <!-- 用户资料内容 -->
        <VCardText class="profile-content">
          <VRow>
            <!-- 左侧：头像和基本信息 -->
            <VCol cols="12" md="4">
              <div class="profile-sidebar">
                <!-- 头像区域 -->
                <div class="avatar-section">
                  <VAvatar size="120" class="profile-avatar">
                    <VImg :src="userInfo.avatar" alt="用户头像" />
                  </VAvatar>
                  <VBtn
                    v-if="isEditing"
                    size="small"
                    variant="outlined"
                    class="mt-3"
                    @click="handleAvatarUpload"
                  >
                    <VIcon icon="mdi-camera" class="mr-1" />
                    更换头像
                  </VBtn>
                </div>

                <!-- 用户统计 -->
                <div class="user-stats">
                  <h3 class="stats-title">使用统计</h3>
                  <div class="stat-item">
                    <VIcon icon="mdi-chat" class="stat-icon" />
                    <span class="stat-label">对话次数</span>
                    <span class="stat-value">{{ stats.totalChats }}</span>
                  </div>
                  <div class="stat-item">
                    <VIcon icon="mdi-message" class="stat-icon" />
                    <span class="stat-label">消息总数</span>
                    <span class="stat-value">{{ stats.totalMessages }}</span>
                  </div>
                  <div class="stat-item">
                    <VIcon icon="mdi-crown" class="stat-icon" />
                    <span class="stat-label">会员等级</span>
                    <VChip size="small" color="primary">{{ stats.membershipLevel }}</VChip>
                  </div>
                </div>

                <!-- 兴趣标签 -->
                <div class="user-interests">
                  <h3 class="interests-title">兴趣话题</h3>
                  <div class="interest-tags">
                    <VChip
                      v-for="topic in stats.favoriteTopics"
                      :key="topic"
                      size="small"
                      variant="outlined"
                      class="mr-1 mb-1"
                    >
                      {{ topic }}
                    </VChip>
                  </div>
                </div>
              </div>
            </VCol>

            <!-- 右侧：详细信息 -->
            <VCol cols="12" md="8">
              <div class="profile-details">
                <!-- 基本信息 -->
                <div class="info-section">
                  <div class="section-header">
                    <h3 class="section-title">基本信息</h3>
                    <VBtn
                      v-if="!isEditing"
                      size="small"
                      variant="outlined"
                      @click="startEdit"
                    >
                      <VIcon icon="mdi-pencil" class="mr-1" />
                      编辑
                    </VBtn>
                  </div>

                  <div v-if="!isEditing" class="info-display">
                    <div class="info-item">
                      <span class="info-label">用户名</span>
                      <span class="info-value">{{ userInfo.username }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">昵称</span>
                      <span class="info-value">{{ userInfo.nickname }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">邮箱</span>
                      <span class="info-value">{{ userInfo.email }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">手机</span>
                      <span class="info-value">{{ userInfo.phone }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">个人简介</span>
                      <span class="info-value">{{ userInfo.bio }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">所在地</span>
                      <span class="info-value">{{ userInfo.location }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">个人网站</span>
                      <a :href="userInfo.website" target="_blank" class="info-link">
                        {{ userInfo.website }}
                      </a>
                    </div>
                  </div>

                  <!-- 编辑表单 -->
                  <div v-else class="edit-form">
                    <VTextField
                      v-model="editForm.nickname"
                      label="昵称"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />
                    <VTextField
                      v-model="editForm.phone"
                      label="手机号码"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />
                    <VTextarea
                      v-model="editForm.bio"
                      label="个人简介"
                      variant="outlined"
                      density="compact"
                      rows="3"
                      class="mb-3"
                    />
                    <VTextField
                      v-model="editForm.location"
                      label="所在地"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />
                    <VTextField
                      v-model="editForm.website"
                      label="个人网站"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />

                    <!-- 编辑按钮 -->
                    <div class="edit-actions">
                      <VBtn
                        variant="outlined"
                        @click="cancelEdit"
                        :disabled="loading"
                      >
                        取消
                      </VBtn>
                      <VBtn
                        color="primary"
                        @click="saveProfile"
                        :loading="loading"
                        class="ml-2"
                      >
                        保存
                      </VBtn>
                    </div>
                  </div>
                </div>

                <VDivider class="my-6" />

                <!-- 账号信息 -->
                <div class="account-section">
                  <h3 class="section-title">账号信息</h3>
                  <div class="account-info">
                    <div class="info-item">
                      <span class="info-label">注册时间</span>
                      <span class="info-value">{{ userInfo.joinDate }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">最后登录</span>
                      <span class="info-value">{{ userInfo.lastLogin }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <!-- 对话框底部 -->
        <VCardActions class="dialog-actions">
          <VSpacer />
          <VBtn variant="outlined" @click="handleClose">关闭</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.profile-page {
  height: 100%;
}

.profile-dialog {
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

.profile-content {
  padding: 24px;
  min-height: 500px;
}

/* 左侧边栏样式 */
.profile-sidebar {
  padding-right: 24px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 32px;
}

.profile-avatar {
  border: 4px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-stats {
  margin-bottom: 32px;
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
}

.stat-icon {
  color: #666;
  margin-right: 12px;
  font-size: 20px;
}

.stat-label {
  flex: 1;
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.user-interests {
  margin-bottom: 24px;
}

.interests-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
}

/* 右侧详情样式 */
.profile-details {
  padding-left: 24px;
}

.info-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-display .info-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
  margin-right: 16px;
}

.info-value {
  color: #333;
  flex: 1;
  word-break: break-all;
}

.info-link {
  color: #1976d2;
  text-decoration: none;
}

.info-link:hover {
  text-decoration: underline;
}

.edit-form {
  max-width: 400px;
}

.edit-actions {
  margin-top: 16px;
}

.account-section {
  margin-bottom: 24px;
}

.account-info .info-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.dialog-actions {
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 960px) {
  .profile-sidebar {
    padding-right: 0;
    margin-bottom: 24px;
  }

  .profile-details {
    padding-left: 0;
  }

  .avatar-section {
    margin-bottom: 24px;
  }

  .user-stats,
  .user-interests {
    margin-bottom: 24px;
  }
}
</style>
