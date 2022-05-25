<script setup>
import { ref } from "vue"
import DefaultImage from "@/components/common/DefaultImage.vue"
import iconAction from "@/assets/images/svg/icon_action.svg"
import iconDelete from "@/assets/images/svg/icon_delete.svg"
import iconUpload from "@/assets/images/svg/icon_upload.svg"
import iconCopy from "@/assets/images/svg/icon_copy.svg"

const props = defineProps({
  mainSchedule: {
    type: Object
  }
})

const isActionsOepn = ref(false)



</script>
<template>
  <div class="
    relative after:content-[''] after:block after:absolute after:-inset-[4px] after:bg-travel-textgreen 
    after:rounded-[14px] after:pointer-events-none after:opacity-0 after:-z-10 after:transition-opacity
    hover:after:opacity-100
  ">
    <div class="relative rounded-[10px] bg-white shadow overflow-hidden">
      <button @click="isActionsOepn = !isActionsOepn" class="absolute top-[12px] right-[12px] w-[26px] cursor-pointer z-10"><img :src="iconAction" class="w-full h-auto" alt="動作"></button>
      <!-- 動作選單 -->
      <div :class="{ 'block': isActionsOepn, 'hidden': !isActionsOepn }" class="absolute top-[36px] right-[12px] py-[8px] px-[6px] w-[140px] bg-white shadow-md rounded-[5px] overflow-hidden z-10">
        <ul class="w-full">
          <li class="actionlist-item">
            <div class="w-[16px]"><img class="w-full h-auto" :src="iconUpload"></div>
            <div class="ml-[6px] text-[14px] tracking-wider">上傳封面</div>
          </li>
          <li class="actionlist-item">
            <div class="w-[16px]"><img class="w-full h-auto" :src="iconCopy"></div>
            <div class="ml-[6px] text-[14px] tracking-wider">複製行程</div>
          </li>
          <li class="actionlist-item">
            <div class="w-[16px]"><img class="w-full h-auto" :src="iconDelete"></div>
            <div class="ml-[6px] text-[14px] tracking-wider">刪除行程</div>
          </li>
          
        </ul>
      </div>
      <!-- 圖片 -->
      <div>
        <DefaultImage></DefaultImage>
      </div>
      <!-- 卡片文字 -->
      <router-link :to="{ name: 'MainSchedule', params: { mainScheduleId: mainSchedule.id } }" class="block">
        <div class="py-[18px] px-[30px]">
          <div class="mb-[10px]">
            <p>{{ mainSchedule.title }}</p>
          </div>
          <div>
            <p>{{ mainSchedule.start_date }} ~ {{ mainSchedule.end_date }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>