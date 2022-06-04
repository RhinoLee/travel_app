<script setup>
import { ref } from "vue"
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import { useCommonStore } from "@/stores/common"
import DefaultAvatar from "@/components/common/DefaultAvatar.vue"
import logoIcon from "@/assets/images/svg/logo.svg"
import searchIcon from "@/assets/images/svg/icon_search.svg"
import LightBox from "@/components/common/LightBox.vue"
import { useRouter } from "vue-router"

const router = useRouter()
const memberStore = useMemberStore()
const commonStore = useCommonStore()
const { memberInfo, memberName } = storeToRefs(memberStore)
const { isUserMunuOpen } = storeToRefs(commonStore)

function logoutHandler() {
  closeMemberBox()
  memberStore.logoutHandler()
  router.push({ name: "Login" })
}

function closeMemberBox() {
  commonStore.isUserMunuOpen = false
}

</script>

<template>
  <header class="relative py-2 h-[54px] border-b-[2px] border-travel-green bg-white z-30">
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
        <!-- <div class="mr-[18px] w-[15px]"><img :src="searchIcon" class="w-full h-auto"></div>
        <input class="text-[14px] placeholder:tracking-widest placeholder:text-[14px] outline-none" type="text"
          placeholder="輸入行程名稱以搜尋"> -->
      </div>
      <!-- account & avatar -->
      <nav class="ml-auto" v-if="memberStore.isLogin">
        <ul class="flex">
          <li class="relative">
            <div class="flex items-center cursor-pointer" @click.stop="commonStore.toggleUserMenu">
              <div class="hidden md:block">{{ memberName }}</div>
              <div class="border-[2px] border-travel-lightgreen ml-[10px] w-[28px] h-[28px] rounded-full overflow-hidden">
                <DefaultAvatar :picture="memberInfo.avatar" height="h-[28px]"></DefaultAvatar>
              </div>
            </div>
            <ul :class="{ 'block': isUserMunuOpen, 'hidden': !isUserMunuOpen }" class="absolute right-0 top-[calc(100%+20px)] w-[120px] py-[7px] px-[15px] bg-white rounded-[10px] z-10
              drop-shadow-[0_0_6px_rgba(0,0,0,0.25)]
              child:py-[5px] child:w-full child:text-center child:tracking-[1px] child:cursor-pointer
              ">
              <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen" @click.stop="closeMemberBox">
                <router-link :to="{ name: 'MemberInfo' }">個人資訊</router-link>
              </li>
              <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen" @click.stop="logoutHandler">帳號登出
              </li>
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