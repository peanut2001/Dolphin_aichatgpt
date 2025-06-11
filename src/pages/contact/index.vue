<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContactUs from './components/contactus.vue'

// 状态管理
const router = useRouter()

// 响应式数据
const dialogOpen = ref(false)

// 监听路由变化，当进入联系我们页面时打开对话框
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
  <div class="contact-page">
    <ContactUs 
      :dialog-open="dialogOpen"
      @update:dialog-open="handleDialogUpdate"
      @close="handleClose"
    />
  </div>
</template>

<style scoped>
.contact-page {
  height: 100%;
}
</style>
