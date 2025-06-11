<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserSettings from './components/usersettings.vue'

// 状态管理
const router = useRouter()

// 响应式数据
const dialogOpen = ref(false)

// 监听路由变化，当进入设置页面时打开对话框
onMounted(() => {
  dialogOpen.value = true
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
</script>

<template>
  <div class="settings-page">
    <UserSettings 
      :dialog-open="dialogOpen"
      @update:dialog-open="handleDialogUpdate"
      @close="handleClose"
    />
  </div>
</template>

<style scoped>
.settings-page {
  height: 100%;
}
</style>
