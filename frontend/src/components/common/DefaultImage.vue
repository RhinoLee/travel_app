<script setup>
import icon_picture from "@/assets/images/svg/icon_picture.svg"
const props = defineProps({
  height: {
    type: String,
    default: "pt-[50%]"
  },
  picture: {
    type: String,
    default: ""
  }
})
</script>
<template>
  <!-- default start -->
  <div v-if="!picture" :class="[height]" class="relative w-full h-full bg-travel-green">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px]">
      <img :src="icon_picture" class="w-full h-full object-contain object-center">
    </div>
  </div>
  <!-- default end -->

  <div v-if="picture">
    <div :class="[height]" class="relative w-full h-full overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <img :src="picture" class="w-full h-full object-cover object-center">
      </div>
    </div>
  </div>
</template>