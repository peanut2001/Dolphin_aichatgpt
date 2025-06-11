<script setup>
import { ref } from 'vue'
import FeatureCard from './featurecard.vue'

// 功能卡片数据
const features = ref([
  {
    id: 1,
    icon: 'mdi-stethoscope',
    title: '医学咨询',
    color: 'primary'
  },
  {
    id: 2,
    icon: 'mdi-heart-pulse',
    title: '心脏超声',
    color: 'red'
  },
  {
    id: 3,
    icon: 'mdi-account-heart',
    title: '妇科检查',
    color: 'pink'
  },
  {
    id: 4,
    icon: 'mdi-shield-check',
    title: '诊断建议',
    color: 'green'
  },
  {
    id: 5,
    icon: 'mdi-chart-line',
    title: '数据分析',
    color: 'orange'
  },
  {
    id: 6,
    icon: 'mdi-school',
    title: '学习资源',
    color: 'purple'
  }
])

// Emits
const emit = defineEmits(['feature-click'])

// 方法
const handleFeatureClick = (feature) => {
  console.log('点击功能卡片:', feature.title)
  emit('feature-click', feature)
}
</script>

<template>
  <div class="feature-cards">
    <VContainer>
      <VRow>
        <VCol
          v-for="feature in features"
          :key="feature.id"
          cols="6"
          sm="4"
          md="2"
        >
          <FeatureCard
            :icon="feature.icon"
            :title="feature.title"
            :color="feature.color"
            @click="handleFeatureClick(feature)"
          />
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
.feature-cards {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feature-cards {
    padding: 0 8px;
  }
}
</style>
