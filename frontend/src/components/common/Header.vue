<script setup>
import { ref } from "vue"
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import { useCommonStore } from "@/stores/common"
import logoIcon from "@/assets/images/svg/logo.svg"
import searchIcon from "@/assets/images/svg/icon_search.svg"
import LightBox from "@/components/common/LightBox.vue"
import { useRouter } from "vue-router"

const isMemberBoxOpen = ref(false)

const router = useRouter()
const memberStore = useMemberStore()
const commonStore = useCommonStore()
const { memberInfo, memberName } = storeToRefs(memberStore)

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
  <header class="relative py-2 h-[54px] border-b-[2px] border-travel-green bg-white z-50">
    <div class="flex items-center h-full px-[24px] xl:px-4 max-w-[1600px] mx-auto">
      <!-- burgur-menu -->
      <div @click="commonStore.toggleMenu" class="md:hidden w-[20px] h-[12px] cursor-pointer">
        <div class="burger-menu"></div>
      </div>
      <!-- logo -->
      <div class="ml-auto w-[94px] md:ml-0 md:w-[108px] ">
        <router-link :to="{ name: 'MainSchedules' }" class="block w-full">
          <img :src="logoIcon" class="w-full h-auto" alt="旅行筆記">
        </router-link>
      </div>
      <!-- search -->
      <div class="hidden md:flex items-center ml-[70px]">
        <div class="mr-[18px] w-[15px]"><img :src="searchIcon" class="w-full h-auto"></div>
        <input class="text-[14px] placeholder:tracking-widest placeholder:text-[14px] outline-none" type="text" placeholder="輸入行程名稱以搜尋">
      </div>
      <!-- account & avatar -->
      <nav class="ml-auto" v-if="memberStore.isLogin">
        <ul class="flex">
          <li class="relative">
            <div class="flex items-center" @click="isMemberBoxOpen = !isMemberBoxOpen">
              <div class="hidden md:block">{{ memberName }}</div>
              <div v-if="memberInfo.avatar" class="border-[2px] border-travel-lightgreen ml-[10px] w-[32px] h-[32px] rounded-full overflow-hidden"><img :src="memberInfo.avatar" class="w-full h-full object-cover object-center"></div>
            </div>
            <ul 
              :class="{ 'block': isMemberBoxOpen, 'hidden': !isMemberBoxOpen }" 
              class="absolute top-full w-full bg-white border z-10
              child:py-1 px-1 child:w-full child:text-center child:cursor-pointer
              "
            >
              <li @click="closeMemberBox"><router-link :to="{ name: 'MemberInfo' }">個人資訊</router-link></li>
              <li @click="logoutHandler">登出</li>
            </ul>
          </li>
        </ul>
      </nav>
      <!-- register & logout -->
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