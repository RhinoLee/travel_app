<script setup>
import { onMounted, ref } from "vue"
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import { useRouter } from "vue-router"
import LoginForm from "@/components/form/LoginForm.vue";
import LightBox from "@/components/common/LightBox.vue"
import LandingPage from "@/components/member/LandingPage.vue"


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

onMounted(() => {
  if (memberStore.isLogin) return router.push({ name: "MainSchedules" })
})



</script>
<template>
  <LandingPage>
    <template v-slot:nav>
      <div class="member-form-nav">
        <router-link class="member-form-nav-text-active" :to="{ name: 'Login' }">
          登入
        </router-link>
      </div>
      <div class="member-form-nav">
        <router-link class="member-form-nav-text" :to="{ name: 'Register' }">註冊</router-link>
      </div>
    </template>
    <template v-slot:form>
      <LoginForm @submitHandler="submitHandler"></LoginForm>
    </template>
  </LandingPage>

  <LightBox v-model:isBoxOpen="memberStore.isErrorBoxOpen">
    <template v-slot:title>登入失敗</template>
    <template v-slot:submit-btn>
      <div class="flex">
        <button @click="hideBox('isErrorBoxOpen')" type="button"
          class="mr-4 bg-disabled lightbox-submit-btn">Cancel</button>
        <button @click="sendVerifyEmail" type="button" class="bg-travel-textgreen lightbox-submit-btn">發送驗證信</button>
      </div>
    </template>
    <template v-slot:main>
      <div>信箱尚未驗證</div>
    </template>
  </LightBox>

  <LightBox v-model:isBoxOpen="memberStore.isVerifyResultBoxOpen">
    <template v-slot:title>寄信通知</template>
    <template v-slot:submit-btn>
      <button @click="hideBox('isVerifyResultBoxOpen')" type="button"
        class="bg-travel-textgreen lightbox-submit-btn">關閉通知</button>
    </template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
  </LightBox>
</template>