<script setup>
import { useRouter } from 'vue-router';
import { useMemberStore } from "@/stores/member"

let redirectTimeout = null

const router = useRouter()
const memberStore = useMemberStore()
const verifyMsg = ref("")

async function sendVerifyEmail() {
  const result = await memberStore.resetPasswordEmail(memberStore.forgotPasswordParams.email)
  memberStore.forgotPasswordParams.email = ""

  if (result.success) verifyMsg.value = "驗證信寄送成功，請至信箱收信（或垃圾信箱），謝謝"
  else verifyMsg.value = "驗證信寄送失敗，請稍後再嘗試，謝謝"

  memberStore.isVerifyResultBoxOpen = true
  redirectTimeout = setTimeout(() => {
    hideBox('isVerifyResultBoxOpen')
    router.push({ name: "Login" })
  }, 3000)
}

function hideBox(boxname) {
  memberStore[boxname] = false
}

onBeforeUnmount(() => {
  clearTimeout(redirectTimeout)
})

</script>
<template>
  <LandingPage>
    <template v-slot:nav>

      <div class="member-form-nav">
        <router-link class="member-form-nav-text" :to="{ name: 'Login' }">
          登入
        </router-link>
      </div>
      <div class="member-form-nav">
        <router-link class="member-form-nav-text-active" :to="{ name: 'ForgotPassword' }">
          忘記密碼
        </router-link>
      </div>
    </template>
    <template v-slot:form>
      <ForgotPasswordForm @submitHandler="sendVerifyEmail"></ForgotPasswordForm>
    </template>
  </LandingPage>

  <LightBox v-model:isBoxOpen="memberStore.isVerifyResultBoxOpen" :maskDisabled="true">
    <template v-slot:title>寄信通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
  </LightBox>
</template>