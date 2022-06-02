<script setup>
import { onMounted } from "vue"
import { useMemberStore } from "@/stores/member"
import { useRouter } from "vue-router"
import RegisterForm from "@/components/form/RegisterForm.vue";
import LandingPage from "@/components/member/LandingPage.vue"

const router = useRouter()
const memberStore = useMemberStore()

async function submitHandler(formParams) {
  memberStore.registerParams = formParams
  const result = await memberStore.registerHandler()
  if (result) return router.push({ name: "Login" })
}

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
        <router-link class="member-form-nav-text-active"
          :to="{ name: 'Register' }">
          註冊
        </router-link>
      </div>
    </template>
    <template v-slot:form>
      <RegisterForm @submitHandler="submitHandler"></RegisterForm>
    </template>
  </LandingPage>
</template>