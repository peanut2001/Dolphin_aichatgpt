<script setup>
import { ref } from "vue"

// Props
const props = defineProps({
  dialogOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(["update:dialog-open", "close"])

// 响应式数据
const contactForm = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
})

const isSubmitting = ref(false)

// 联系方式数据
const contactInfo = [
  {
    icon: "mdi-email",
    title: "邮箱联系",
    content: "support@dolphinai.com",
    description: "工作日24小时内回复",
  },
  {
    icon: "mdi-phone",
    title: "电话咨询",
    content: "400-888-9999",
    description: "工作时间：9:00-18:00",
  },
  {
    icon: "mdi-map-marker",
    title: "公司地址",
    content: "北京市朝阳区科技园区",
    description: "欢迎预约参观",
  },
  {
    icon: "mdi-wechat",
    title: "微信客服",
    content: "DolphinAI_Support",
    description: "扫码添加客服微信",
  },
]

// 方法
const handleClose = () => {
  emit("update:dialog-open", false)
  emit("close")
}

const handleSubmit = async () => {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    console.log("请填写必要信息")
    return
  }

  isSubmitting.value = true

  try {
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("提交联系表单:", contactForm.value)

    // 重置表单
    contactForm.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    }

    console.log("消息发送成功！")
  } catch (error) {
    console.error("发送失败，请稍后重试")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <VDialog :model-value="dialogOpen" max-width="900" persistent scrollable>
    <VCard class="contact-dialog">
      <!-- 对话框头部 -->
      <VCardTitle class="dialog-header">
        <VIcon icon="mdi-phone" class="mr-2" />
        <span class="dialog-title">联系我们</span>
        <VBtn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </VCardTitle>

      <VCardText class="contact-content">
        <VContainer class="contact-container">
          <VRow>
            <!-- 联系方式信息 -->
            <VCol cols="12" md="6">
              <VCard class="contact-info-card">
                <VCardTitle>
                  <VIcon icon="mdi-information" class="mr-2" />
                  联系方式
                </VCardTitle>
                <VCardText>
                  <div class="contact-info-list">
                    <div v-for="info in contactInfo" :key="info.title" class="contact-info-item">
                      <div class="info-icon">
                        <VIcon :icon="info.icon" size="24" color="primary" />
                      </div>
                      <div class="info-content">
                        <h4 class="info-title">{{ info.title }}</h4>
                        <p class="info-text">{{ info.content }}</p>
                        <p class="info-description">{{ info.description }}</p>
                      </div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- 联系表单 -->
            <VCol cols="12" md="6">
              <VCard class="contact-form-card">
                <VCardTitle>
                  <VIcon icon="mdi-message-text" class="mr-2" />
                  发送消息
                </VCardTitle>
                <VCardText>
                  <VForm @submit.prevent="handleSubmit">
                    <VTextField
                      v-model="contactForm.name"
                      label="姓名 *"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                      required />

                    <VTextField
                      v-model="contactForm.email"
                      label="邮箱 *"
                      type="email"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                      required />

                    <VTextField
                      v-model="contactForm.subject"
                      label="主题"
                      variant="outlined"
                      density="compact"
                      class="mb-3" />

                    <VTextarea
                      v-model="contactForm.message"
                      label="消息内容 *"
                      variant="outlined"
                      rows="4"
                      class="mb-3"
                      required />

                    <VBtn
                      type="submit"
                      color="primary"
                      :loading="isSubmitting"
                      :disabled="isSubmitting"
                      block>
                      {{ isSubmitting ? "发送中..." : "发送消息" }}
                    </VBtn>
                  </VForm>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- 常见问题 -->
          <VRow class="mt-6">
            <VCol cols="12">
              <VCard class="faq-card">
                <VCardTitle>
                  <VIcon icon="mdi-help-circle" class="mr-2" />
                  常见问题
                </VCardTitle>
                <VCardText>
                  <VExpansionPanels>
                    <VExpansionPanel title="如何开始使用Dolphin AI？">
                      <VExpansionPanelText>
                        注册账号后，您可以直接开始与AI助手对话。我们提供详细的使用指南帮助您快速上手。
                      </VExpansionPanelText>
                    </VExpansionPanel>

                    <VExpansionPanel title="数据安全如何保障？">
                      <VExpansionPanelText>
                        我们采用企业级加密技术，确保您的数据安全。所有对话内容都经过加密处理，严格保护用户隐私。
                      </VExpansionPanelText>
                    </VExpansionPanel>

                    <VExpansionPanel title="如何获得技术支持？">
                      <VExpansionPanelText>
                        您可以通过邮件、电话或在线客服获得技术支持。我们的技术团队将在24小时内响应您的问题。
                      </VExpansionPanelText>
                    </VExpansionPanel>
                  </VExpansionPanels>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.contact-dialog {
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

.contact-content {
  padding: 24px;
  max-height: 70vh;
}

.contact-container {
  max-width: 100%;
}

.contact-info-card,
.contact-form-card,
.faq-card {
  height: 100%;
  border-radius: 8px;
}

.contact-info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.info-text {
  font-size: 14px;
  font-weight: 500;
  color: #1976d2;
  margin: 0 0 4px 0;
}

.info-description {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-content {
    padding: 16px;
  }

  .contact-info-item {
    gap: 12px;
  }

  .info-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
