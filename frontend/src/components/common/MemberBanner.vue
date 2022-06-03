<script setup>
import LogoIcon from "@/assets/images/svg/icon_login_whitelogo.svg"
import LogoBgIcon from "@/assets/images/svg/icon_login_white_logo_bg.svg"
import ArrowIcon from "@/assets/images/svg/icon_login_arrow.svg"
import MemberBg from "@/assets/images/png/img_login_bg.png"
import LogoGif from "@/assets/images/gif/icon_login_whitelogobg.gif"
</script>
<template>
  <div class="relative w-full h-[200px] md:h-[320px] lg:h-full">
    <img :src="MemberBg" class="block w-full h-full object-cover object-center">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] md:w-[180px] lg:w-[297px]">
      <!-- <img :src="LogoGif" class="w-full h-auto"> -->
      <img :src="LogoBgIcon" class="w-full h-auto">
    </div>
    <div class="hidden absolute lg:block lg:top-1/2 lg:w-[78px] lg:left-[calc(100%-18px)] lg:-translate-y-1/2">
      <img :src="ArrowIcon" class="w-full h-auto">
    </div>
  </div>
</template>