<script setup>
import { ref } from "vue"
import { useMemberStore } from "@/stores/member"
import LightBox from "@/components/common/LightBox.vue"
import { useRouter } from "vue-router"

const isMemberBoxOpen = ref(false)

const router = useRouter()
const memberStore = useMemberStore()

function logoutHandler() {
  closeMemberBox()
  memberStore.logoutHandler()
  router.push({ name: "Login" })
}

function closeMemberBox() {
  isMemberBoxOpen.value = false
}

</script>

<template>
  <header class="py-2 h-[60px] border-b">
    <div class="flex items-center justify-between h-full px-3 xl:px-4 max-w-screen-lg mx-auto">
      <div>Logo</div>
      <nav v-if="memberStore.isLogin">
        <ul class="flex">
          <li class="relative"><button @click="isMemberBoxOpen = !isMemberBoxOpen">{{ memberStore.memberInfo.email }}</button>
            <ul 
              :class="{ 'block': isMemberBoxOpen, 'hidden': !isMemberBoxOpen }" 
              class="absolute top-full w-full bg-white border
              child:py-1 px-1 child:w-full child:text-center child:cursor-pointer
              "
            >
              <li @click="closeMemberBox"><router-link :to="{ name: 'MemberInfo' }">個人資訊</router-link></li>
              <li @click="logoutHandler">登出</li>
            </ul>
          </li>
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