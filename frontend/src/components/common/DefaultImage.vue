<script setup>
import icon_picture from "@/assets/images/svg/icon_picture.svg"
</script>
<template>
  <div class="relative w-full pt-[50%] bg-travel-green">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px]">
      <img :src="icon_picture" class="w-full h-full object-contain">
    </div>
  </div>
</template>