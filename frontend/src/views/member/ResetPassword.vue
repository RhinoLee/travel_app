<script setup>
import { onMounted, ref } from "vue"
import { useMemberStore } from "@/stores/member"
import { useRoute, useRouter } from 'vue-router';
import ResetPasswordForm from "@/components/form/ResetPasswordForm.vue";
import LightBox from "@/components/common/LightBox.vue"

const router = useRouter()
const routes = useRoute()
// const token = ref("")
const verifyMsg = ref("")

const memberStore = useMemberStore()

async function submitHandler() {
  const result = await memberStore.resetPasswordandler(routes.query.token)

  if (result.success) verifyMsg.value = "密碼重設成功，即將幫您導向登入頁面"
  else verifyMsg.value = "密碼重設失敗，請稍後再嘗試，即將幫您導向登入頁面"

  redirectTimeout = setTimeout(() => {
    router.push({ name: "Login" })
  }, 3000)
}

function hideBox(boxname) {
  memberStore[boxname] = false
}

</script>
<template>
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[450px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">重設密碼</h1>
        </header>
        <main class="h-full">
          <ResetPasswordForm @submitHandler="submitHandler"></ResetPasswordForm>
        </main>
      </div>
    </div>
  </div>

  <LightBox v-model:isBoxOpen="memberStore.isResetPasswordResultBoxOpen">
    <template v-slot:title>重設密碼通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
    <template v-slot:footer>
      <div class="flex w-full">
        <button @click="hideBox('isResetPasswordResultBoxOpen')" type="button"
          class="block mt-auto mr-4 px-4 py-2 shadow-lg">關閉通知</button>
      </div>
    </template>
  </LightBox>
</template>