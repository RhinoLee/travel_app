<script setup>
import ArrowIcon from "@/assets/images/svg/icon_traffic_arrow.svg"

const props = defineProps({
  duration: {
    type: String,
  },
  distance: {
    type: String,
  },
})
</script>
<template>
  <div class="flex items-center py-[8px] pl-[10px]">
    <div class="w-[5px] h-[52px]">
      <img :src="ArrowIcon" class="w-full h-full object-cover object-center">
    </div>
    <div class="pl-[16px] child:text-[14px] child:text-travel-darkgold child:leading-6">
      <p>預計時間：{{ distance }}</p>
      <p>車程：{{ duration }}</p>  
    </div>
  </div>
</template>