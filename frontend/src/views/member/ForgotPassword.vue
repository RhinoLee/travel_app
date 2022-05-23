<script setup>
import { ref, onBeforeUnmount } from "vue"
import { useRouter } from 'vue-router';
import { useMemberStore } from "@/stores/member"
import ForgotPasswordForm from "@/components/form/ForgotPasswordForm.vue";
import LightBox from "@/components/common/LightBox.vue"
let redirectTimeout = null

const router = useRouter()
const memberStore = useMemberStore()
const verifyMsg = ref("")

async function sendVerifyEmail() {
  const result = await memberStore.resetPasswordEmail(memberStore.forgotPasswordParams.email)
  memberStore.forgotPasswordParams.email = ""

  if (result.success) verifyMsg.value = "驗證信寄送成功，請至信箱收信，謝謝"
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
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[400px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">忘記密碼</h1>
        </header>
        <main class="h-full">
          <ForgotPasswordForm @submitHandler="sendVerifyEmail"></ForgotPasswordForm>
        </main>
      </div>
    </div>
  </div>

  <LightBox v-model:isBoxOpen="memberStore.isVerifyResultBoxOpen">
    <template v-slot:header>寄信通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
    <template v-slot:footer>
      <div class="flex w-full">
        <button @click="hideBox('isVerifyResultBoxOpen')" type="button"
          class="block mt-auto mr-4 px-4 py-2 shadow-lg">關閉通知</button>
      </div>
    </template>
  </LightBox>
</template>