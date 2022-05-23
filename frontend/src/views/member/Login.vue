<script setup>
import { ref } from "vue"
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import { useRouter } from "vue-router"
import LoginForm from "@/components/form/LoginForm.vue";
import LightBox from "@/components/common/LightBox.vue"


const router = useRouter()
const memberStore = useMemberStore()
const { isErrorBoxOpen, isVerifyResultBoxOpen } = storeToRefs(memberStore)
const verifyMsg = ref("")

async function submitHandler(formParams) {
  memberStore.loginParams = formParams

  const result = await memberStore.loginHandler()
  if (result.success) return router.push({ name: "MainSchedules" })

  // 登入失敗，信箱未驗證 -> lightbox 請 user 驗證
  if (result.error && result.error === "信箱尚未驗證") {
    memberStore.verifyMemberEmail = result.data.email
    memberStore.isErrorBoxOpen = true
  }
}

async function sendVerifyEmail() {
  const result = await memberStore.verifyEmail(memberStore.verifyMemberEmail)
  memberStore.isErrorBoxOpen = false
  memberStore.clearLoginParams()
  
  if (result.success) verifyMsg.value = "驗證信寄送成功，請至信箱收信，謝謝"
  else verifyMsg.value = "驗證信寄送失敗，請稍後再嘗試，謝謝"
  
  memberStore.isVerifyResultBoxOpen = true
}

function hideBox(boxname) {
  memberStore[boxname] = false
}

</script>
<template>
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[400px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">登入</h1>
        </header>
        <main class="h-full">
          <LoginForm @submitHandler="submitHandler"></LoginForm>
        </main>
      </div>
    </div>
  </div>

  <LightBox v-model:isBoxOpen="memberStore.isErrorBoxOpen">
    <template v-slot:header>登入失敗</template>
    <template v-slot:main>
      <div>信箱尚未驗證</div>
    </template>
    <template v-slot:footer>
      <div class="flex w-full">
        <button @click="hideBox('isErrorBoxOpen')" type="button" class="block mt-auto mr-4 px-4 py-2 shadow-lg">Cancel</button>
        <button @click="sendVerifyEmail" type="button" class="mt-auto block px-4 py-2 shadow-lg">發送驗證信</button>
      </div>
    </template>
  </LightBox>

  <LightBox v-model:isBoxOpen="memberStore.isVerifyResultBoxOpen">
    <template v-slot:header>寄信通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
    <template v-slot:footer>
      <div class="flex w-full">
        <button @click="hideBox('isVerifyResultBoxOpen')" type="button" class="block mt-auto mr-4 px-4 py-2 shadow-lg">關閉通知</button>
      </div>
    </template>
  </LightBox>
</template>