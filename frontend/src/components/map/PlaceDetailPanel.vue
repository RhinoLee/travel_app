<script setup>
import { ref, watch } from "vue"
import cancelIcon from "@/assets/images/svg/icon_cancel_gray.svg"
import LitneraryIcon from "@/assets/images/svg/icon_litnerary.svg"

const props = defineProps({
  placeDetail: {
    type: Object
  }
})

watch(
  () => props.placeDetail,
  newVal => {
    triggerPanel(Boolean(newVal))
  }
)
const isPanelOpen = ref(false)
const emit = defineEmits(["addLocateToSchedule", "closePanel", "addPlaceCollection", "removePlaceCollection"])

function addLocateToSchedule() {
  emit("addLocateToSchedule")
}

function addPlaceCollection() {
  emit("addPlaceCollection")
}

function removePlaceCollection(collectId) {
  emit("removePlaceCollection", collectId)
  triggerPanel(false)
}

function triggerPanel(isOpen) {
  isPanelOpen.value = isOpen
  if (!isOpen) emit("closePanel")
}

</script>

<template>
  <div v-if="placeDetail" :class="{ hidden: !isPanelOpen }" class="w-[300px] md:w-[358px] h-[calc(94%-54px)]
      absolute left-1/2 md:left-[320px] top-[50%] -translate-y-[calc(50%-27px)] -translate-x-[50%] md:-translate-x-0 py-[14px] px-[20px] 
      bg-white/80 backdrop-blur-[4px] z-10 shadow-lg rounded-[10px] descendant:tracking-[1px]
      lg:left-[408px] overflow-y-scroll no-scrollbar
    ">

    <!-- 按鈕區 -->
    <div class="absolute top-0 left-0 flex items-center border-t border-travel-green px-[20px] w-full h-[64px] z-10  bg-travel-lightgreen rounded-tr-[10px] rounded-tl-[10px] overflow-hidden">
      <!-- close btn -->
      <div class="flex items-center mr-auto">
        <button @click.stop="triggerPanel(false)" class="w-[20px] h-[20px]" type="button">
          <img class="w-full h-full object-cover object-center" :src="cancelIcon" alt="刪除">
        </button>
      </div>
      <!-- 加入行程 btn -->
      <button @click="addLocateToSchedule"
        class="flex items-center justify-center border border-travel-textgreen px-[23px] py-[8px] rounded-[5px]">
        <div class="mr-[4px] w-[24px]">
          <img :src="LitneraryIcon" class="w-full h-auto" />
        </div>
        <span class="text-travel-textgreen">加入行程</span>
      </button>
      <!-- <button v-if="!placeDetail.isCollect" @click="addPlaceCollection" class="border px-4 py-2 ml-2">加入收藏</button>
      <button v-if="placeDetail.isCollect" @click="removePlaceCollection(placeDetail.collectId)"
        class="border px-4 py-2 ml-2">移除收藏</button> -->
    </div>

    <div class="flex flex-col pt-[64px] h-full overflow-y-scroll no-scrollbar">

      <!-- 景點名稱 -->
      <div class="mb-[5px]">
        <p class="text-travel-textgreen text-[20px] md:text-[24px] tracking-[1px]">{{ placeDetail.name }}</p>
      </div>

      <!-- 景點圖片 -->
      <div v-if="placeDetail.photos && placeDetail.photos.length > 0" class="mb-[12px] w-full">
        <img class="w-full h-auto overflow-hidden rounded-[10px]"
          :src="placeDetail.photos[0]" alt="">
      </div>
      <!-- 景點資訊 -->
      <div class="child:py-[4px] md:child:py-[8px]">
        <!-- 景點評價 -->
        <div class="py-[8px]">地址：{{ placeDetail.address }}</div>
        <div class="py-[8px]">聯絡電話：{{ placeDetail.phone_number }}</div>
        <div class="py-[8px]">評價：{{ placeDetail.rating }} / 5</div>
        <div class="py-[8px]">評價數：{{ placeDetail.user_ratings_total }}</div>
        <div class="py-[8px]">
          <p class="pb-1">營業時間：</p>
          <div v-if="placeDetail.opening_hours" class="max-h-[70px] md:max-h-[200px]">
            <p v-for="(text, idx) in placeDetail.opening_hours.weekday_text" :key="idx" class="pt-1">{{ text }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>