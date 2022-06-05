<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue"
import { useMemberStore } from "@/stores/member"
import { useRoute, useRouter } from 'vue-router';
import ResetPasswordForm from "@/components/form/ResetPasswordForm.vue";
import LightBox from "@/components/common/LightBox.vue"
import LandingPage from "@/components/member/LandingPage.vue"

let redirectTimeout = null

const router = useRouter()
const routes = useRoute()
// const token = ref("")
const verifyMsg = ref("")

const memberStore = useMemberStore()

async function submitHandler() {
  const result = await memberStore.resetPasswordHandler(routes.query.token)

  if (result.success) verifyMsg.value = "密碼重設成功，即將幫您導向登入頁面"
  else verifyMsg.value = "密碼重設失敗，請稍後再嘗試，即將幫您導向登入頁面"

  memberStore.isResetPasswordResultBoxOpen = true
  redirectTimeout = setTimeout(() => {
    hideBox('isResetPasswordResultBoxOpen')
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
        <span class="member-form-nav-text-active">
          重設密碼
        </span>
      </div>
    </template>

    <template v-slot:form>
      <ResetPasswordForm @submitHandler="submitHandler"></ResetPasswordForm>
    </template>
  </LandingPage>

  <LightBox v-model:isBoxOpen="memberStore.isResetPasswordResultBoxOpen" :maskDisabled="true">
    <template v-slot:title>重設密碼通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
  </LightBox>
</template>