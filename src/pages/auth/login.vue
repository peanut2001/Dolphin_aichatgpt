<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authstore"
import logoUrl from "@/assets/logo.png"

// 路由和状态管理
const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = ref({
  username: "",
  password: "",
})

// 表单验证状态
const showPassword = ref(false)
const rememberMe = ref(true)

// 计算属性
const isFormValid = computed(() => {
  return form.value.username.trim() !== "" && form.value.password.trim() !== ""
})

// 登录方法
const handleLogin = async () => {
  if (!isFormValid.value) return

  const result = await authStore.login({
    username: form.value.username,
    password: form.value.password,
  })

  if (result.success) {
    router.push({ name: "home" })
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-page">
    <div class="left-section">
      <div class="illustration-container">
        <div class="character-illustration">
          <img src="@/assets/images/demo.png" alt="登录页面插图" class="demo-image" />
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="login-form-container">
        <div class="brand-section">
          <div class="brand-logo">
            <img :src="logoUrl" alt="Dolphin AI Logo" class="logo-image" />
            <span class="dolphin-text">Dolphin AI</span>
          </div>
          <h1 class="brand-title">智能医疗应用平台</h1>
          <p class="brand-subtitle">来自于海豚之声研发部，一群执着探索医疗的小分队</p>
        </div>

        <VForm class="login-form" @submit.prevent="handleLogin">
          <VTextField
            v-model="form.username"
            label="请输入用户名"
            variant="outlined"
            class="form-field"
            hide-details />

          <!-- 密码输入框 -->
          <VTextField
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="请输入密码"
            variant="outlined"
            class="form-field"
            hide-details
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="togglePasswordVisibility" />

          <!-- 记住密码选项 -->
          <VCheckbox v-model="rememberMe" color="#4a90e2" class="remember-checkbox" hide-details>
            <template #label>
              <span class="checkbox-label">
                记住密码，同意《<span class="link-text">隐私政策</span>》和《<span class="link-text"
                  >用户协议</span
                >》
              </span>
            </template>
          </VCheckbox>

          <!-- 登录按钮 -->
          <VBtn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="authStore.loading"
            :disabled="!isFormValid"
            class="login-btn">
            登录
          </VBtn>
        </VForm>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* 左侧插图区域 */
.left-section {
  flex: 0.7;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.illustration-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.character-illustration {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-image {
  max-width: 80%;
  max-height: 80%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
}

/* 右侧登录表单区域 */
.right-section {
  flex: 1;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.brand-section {
  text-align: left;
  margin-bottom: 2rem;
}

.brand-logo {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.logo-image {
  width: 48px;
  height: 48px;
  margin-right: 0.75rem;
  object-fit: contain;
}

.dolphin-text {
  color: #4a90e2;
  font-size: 2rem;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
}

.brand-title {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.brand-subtitle {
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
}

.login-form {
  width: 100%;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-field :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.08);
  border-color: #4a90e2;
}

.form-field :deep(.v-label) {
  color: rgba(255, 255, 255, 0.7);
}

.form-field :deep(.v-field__input) {
  color: white;
}

.form-field :deep(.v-icon) {
  color: rgba(255, 255, 255, 0.7);
}

.remember-checkbox {
  margin-bottom: 2rem;
}

.remember-checkbox :deep(.v-selection-control__input) {
  color: #4a90e2;
}

.remember-checkbox :deep(.v-checkbox .v-selection-control__input .v-icon) {
  color: #4a90e2;
}

.checkbox-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.link-text {
  color: #4a90e2;
  text-decoration: underline;
  cursor: pointer;
}

.link-text:hover {
  color: #357abd;
}

.login-btn {
  background: #4a90e2 !important;
  color: white;
  border-radius: 8px;
  height: 48px;
  font-size: 1rem;
  font-weight: 500;
  text-transform: none;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}

.login-btn:hover {
  background: #357abd !important;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .left-section {
    height: 40vh;
  }

  .right-section {
    height: 60vh;
    padding: 1rem;
  }

  .demo-image {
    max-width: 90%;
    max-height: 90%;
  }
}
</style>
