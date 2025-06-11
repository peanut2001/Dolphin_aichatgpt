<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <VContainer class="fill-height">
    <VRow
      align="center"
      justify="center"
    >
      <VCol
        cols="12"
        sm="8"
        md="6"
        class="text-center"
      >
        <VIcon
          icon="mdi-emoticon-sad-outline"
          size="120"
          color="primary"
          class="mb-4"
        />
        
        <h1 class="text-h3 mb-4">
          页面未找到
        </h1>
        
        <p class="text-h6 mb-6 text-medium-emphasis">
          抱歉，您访问的页面不存在
        </p>
        
        <VBtn
          color="primary"
          size="large"
          @click="goHome"
        >
          返回首页
        </VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
