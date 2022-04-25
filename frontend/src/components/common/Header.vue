<script setup>
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import LightBox from "@/components/common/LightBox.vue"
import { useRouter } from "vue-router"

const router = useRouter()
const memberStore = useMemberStore()

function logoutHandler() {
  memberStore.logoutHandler()
  router.push({ name: "Login" })
}

</script>

<template>
  <header class="py-2 h-[60px] border-b">
    <div class="flex items-center justify-between h-full px-3 xl:px-4 max-w-screen-lg mx-auto">
      <div>Logo</div>
      <nav v-if="memberStore.isLogin">
        <ul class="flex">
          <li class="px-2"><button>{{ memberStore.memberInfo.email }}</button></li>
          <li class="px-2"><button @click="logoutHandler">登出</button></li>
        </ul>
      </nav>
      <nav v-else>
        <ul class="flex">
          <li class="px-2">
            <router-link :to="{ name: 'Register' }">註冊</router-link>
          </li>
          <li class="px-2">
            <router-link :to="{ name: 'Login' }">登入</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>