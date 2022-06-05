<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useMemberStore } from "@/stores/member"
import { useRouter } from "vue-router"
import useInputValidator from "@/composition-api/useInputValidator"
import RegisterForm from "@/components/form/RegisterForm.vue";
import LandingPage from "@/components/member/LandingPage.vue"
import LightBox from "@/components/common/LightBox.vue"

const router = useRouter()
const memberStore = useMemberStore()
const verifyMsg = ref("")
let redirectTimeout = null

const { validateInit } = useInputValidator()

async function submitHandler(formParams) {
  memberStore.registerParams = formParams
  const result = await memberStore.registerHandler()

  validateInit()

  if (result.success) verifyMsg.value = "驗證信寄送成功，請至信箱收信（或垃圾信箱），謝謝"
  else verifyMsg.value = "註冊流程出現錯誤，請稍後再嘗試，謝謝"

  memberStore.isRegisterResultBoxOpen = true
  redirectTimeout = setTimeout(() => {
    hideBox('isRegisterResultBoxOpen')
    router.push({ name: "Login" })
  }, 3000)
}

function hideBox(boxname) {
  memberStore[boxname] = false
}

onMounted(() => {
  memberStore.logoutHandler()
})

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
        <router-link class="member-form-nav-text-active" :to="{ name: 'Register' }">
          註冊
        </router-link>
      </div>
    </template>
    <template v-slot:form>
      <RegisterForm @submitHandler="submitHandler"></RegisterForm>
    </template>
  </LandingPage>

  <LightBox v-model:isBoxOpen="memberStore.isRegisterResultBoxOpen" :maskDisabled="true">
    <template v-slot:title>寄信通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
  </LightBox>
</template>