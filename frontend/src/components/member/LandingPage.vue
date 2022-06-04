<script setup>
import MemberBanner from "@/components/common/MemberBanner.vue"
import LogoIcon from "@/assets/images/svg/icon_login_biglogo.svg"

const props = defineProps({
  hasLogo: {
    type: Boolean,
    default: true
  },
  hasHeader: {
    type: Boolean,
    default: false
  }
})

</script>
<template>
  <div>
    <div class="relative w-screen lg:h-screen">
      <div class="flex flex-wrap w-screen lg:h-full">
        <div class="w-full h-full lg:w-1/2">
          <MemberBanner></MemberBanner>
        </div>
        <div class="relative pb-[40px] w-full h-full lg:pb-0 lg:w-1/2">
          <div class="px-[30px] flex flex-col items-center bg-white lg:absolute lg:left-1/2 lg:top-[18%] lg:-translate-x-1/2 lg:px-0 lg:w-[364px]">
            <!-- logo -->
            <div v-if="hasLogo" class="hidden lg:mb-[58px] lg:block lg:w-[80px]">
              <img :src="LogoIcon" class="w-full h-auto">
            </div>
            <!-- nav 登入 / 註冊 -->
            <nav class="flex items-center justify-center mt-[30px] mb-[10px] w-full lg:mt-0 lg:mb-[30px]">

              <slot name="nav"></slot>
            </nav>
            <!-- form -->
            <slot name="form"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>