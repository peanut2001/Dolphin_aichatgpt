<script setup>
import { ref } from 'vue'

const testMessage = ref('这是测试页面')
const currentTime = ref(new Date().toLocaleString())

const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}
</script>

<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>
            测试页面
          </VCardTitle>
          
          <VCardText>
            <p class="mb-4">{{ testMessage }}</p>
            <p class="mb-4">当前时间: {{ currentTime }}</p>
            
            <VBtn
              color="primary"
              @click="updateTime"
            >
              更新时间
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
/* 测试页面样式 */
</style>
