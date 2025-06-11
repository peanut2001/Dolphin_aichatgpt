<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary'
  },
  clickable: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['click'])

// 计算属性
const cardClasses = computed(() => ({
  'feature-card': true,
  'feature-card--clickable': props.clickable
}))

// 方法
const handleClick = () => {
  if (props.clickable) {
    emit('click', {
      title: props.title,
      icon: props.icon
    })
  }
}
</script>

<template>
  <div
    :class="cardClasses"
    @click="handleClick"
  >
    <div class="card-content">
      <!-- 图标背景圆圈 -->
      <div class="icon-wrapper" :class="`icon-wrapper--${color}`">
        <div class="icon-container">
          <VIcon
            :icon="icon"
            color="white"
            size="28"
          />
        </div>
      </div>

      <!-- 标题 -->
      <h3 class="feature-title">
        {{ title }}
      </h3>
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}

.feature-card--clickable {
  cursor: pointer;
}

.feature-card--clickable:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.feature-card--clickable:hover::before {
  opacity: 1;
}

.feature-card--clickable:active {
  transform: translateY(-4px) scale(1.01);
  transition: all 0.1s ease;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 20px;
  height: 100%;
  min-height: 140px;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.icon-wrapper {
  position: relative;
  margin-bottom: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.icon-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card--clickable:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.feature-card--clickable:hover .icon-container::before {
  opacity: 1;
}

/* 颜色主题 */
.icon-wrapper--primary .icon-container {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3);
}

.icon-wrapper--red .icon-container {
  background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
  box-shadow: 0 8px 20px rgba(211, 47, 47, 0.3);
}

.icon-wrapper--pink .icon-container {
  background: linear-gradient(135deg, #c2185b 0%, #e91e63 100%);
  box-shadow: 0 8px 20px rgba(194, 24, 91, 0.3);
}

.icon-wrapper--green .icon-container {
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
  box-shadow: 0 8px 20px rgba(56, 142, 60, 0.3);
}

.icon-wrapper--orange .icon-container {
  background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);
  box-shadow: 0 8px 20px rgba(245, 124, 0, 0.3);
}

.icon-wrapper--purple .icon-container {
  background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%);
  box-shadow: 0 8px 20px rgba(123, 31, 162, 0.3);
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.02em;
  transition: all 0.3s ease;
}

.feature-card--clickable:hover .feature-title {
  color: #1a252f;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-content {
    padding: 20px 16px;
    min-height: 120px;
  }

  .icon-container {
    width: 50px;
    height: 50px;
    border-radius: 15px;
  }

  .icon-wrapper {
    margin-bottom: 12px;
  }

  .feature-title {
    font-size: 0.9rem;
  }

  .feature-card--clickable:hover {
    transform: translateY(-4px) scale(1.01);
  }
}
</style>
