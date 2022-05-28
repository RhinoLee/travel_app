<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import DefaultImage from "@/components/common/DefaultImage.vue"
import iconAction from "@/assets/images/svg/icon_action.svg"
import iconDelete from "@/assets/images/svg/icon_delete.svg"
import iconUpload from "@/assets/images/svg/icon_upload.svg"
import iconCopy from "@/assets/images/svg/icon_copy.svg"

const travelStore = useTravelStore()
const { nowMainScheduleId, isEditMainScheduleBoxOpen } = storeToRefs(travelStore)

const props = defineProps({
  mainSchedule: {
    type: Object
  }
})

watch(
  nowMainScheduleId,
  (newVal) => {
    // 開啟區塊的 action 列表，並關閉其他區塊 action 列表
    if (newVal !== props.mainSchedule.id) isActionsOpen.value = false
  }
)

watch(
  isEditMainScheduleBoxOpen,
  (newVal) => {
    // 編輯光箱關閉，關閉 action 列表
    if (!newVal) isActionsOpen.value = false
  }
)

const isActionsOpen = ref(false)

function closeActions() {
  if (travelStore.nowMainScheduleId === null || isEditMainScheduleBoxOpen) return
  travelStore.nowMainScheduleId = null
  isActionsOpen.value = false
}

function toggleActions() {
  travelStore.nowMainScheduleId = props.mainSchedule.id
  isActionsOpen.value = !isActionsOpen.value
}

async function editMainSchedule() {
  travelStore.nowMainScheduleId = props.mainSchedule.id
  const result = await travelStore.getMainSchedule()
  travelStore.isEditMainScheduleBoxOpen = true
}

onMounted(() => {
  window.addEventListener("click", (e) => closeActions(e))
})

onBeforeUnmount(() => {
  closeActions()
  window.removeEventListener("click", closeActions)
})


</script>
<template>
  <div class="
    relative after:content-[''] after:block after:absolute after:-inset-[4px] after:bg-travel-textgreen 
    after:rounded-[14px] after:pointer-events-none after:opacity-0 after:-z-10 after:transition-opacity
    hover:after:opacity-100
  ">
    <div class="relative rounded-[10px] bg-white shadow overflow-hidden">
      <button @click.stop="toggleActions" class="absolute top-[12px] right-[12px] w-[26px] cursor-pointer z-10"><img :src="iconAction" class="w-full h-auto" alt="動作"></button>
      <!-- 動作選單 -->
      <div :class="{ 'block': isActionsOpen, 'hidden': !isActionsOpen }" class="absolute top-[36px] right-[12px] py-[8px] px-[6px] w-[140px] bg-white shadow-md rounded-[5px] overflow-hidden z-10">
        <ul class="w-full">
          <li @click.stop="editMainSchedule" class="actionlist-item">
            <div class="w-[16px]"><img class="w-full h-auto" :src="iconUpload"></div>
            <div class="ml-[6px] text-[14px] tracking-wider">編輯行程</div>
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
        <DefaultImage :picture="mainSchedule.picture"></DefaultImage>
      </div>
      <!-- 卡片文字 -->
      <router-link :to="{ name: 'MainSchedule', params: { mainScheduleId: mainSchedule.id } }" class="block">
        <div class="py-[18px] px-[30px]">
          <div class="mb-[10px]">
            <p>{{ mainSchedule.title }}</p>
          </div>
          <div>
            <p>{{ mainSchedule.startDate }} ~ {{ mainSchedule.endDate }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>