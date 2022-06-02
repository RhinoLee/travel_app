<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
import Map from "@/components/map/Map.vue"
import SearchPlace from "@/components/map/SearchPlace.vue"
import PlaceDetailPanel from "@/components/map/PlaceDetailPanel.vue"
import ScheduleList from "@/components/travel/ScheduleList.vue"
import ScheduleDates from "@/components/travel/ScheduleDates.vue"
import LightBox from "@/components/common/LightBox.vue"
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";
import EditScheduleForm from "@/components/form/EditScheduleForm.vue";
import AddScheduleForm from "@/components/form/AddScheduleForm.vue";

const travelStore = useTravelStore()
const { mainScheduleInfo, locationSearchList, nowDateScheduleList, directions, placeCollectionsList, placeInfoComputed, durationDateList, nowSelectDate, isMenuOpen, isDeleteScheduleBoxOpen } = storeToRefs(travelStore)
const route = useRoute()
const router = useRouter()

// 偵測旅行日期變化
watch(
  nowSelectDate,
  async (newVal) => {
    travelStore.cancelSelectSchedule()
    // 設定 addScheDuleParams 預設值
    travelStore.addScheDuleParams.date = newVal
    // 關閉地點資訊面板
    travelStore.placeDetail = null
    // 重新取得路線
    travelStore.clearDirections()
    await travelStore.getDirections()
    if (newVal) return router.push({ name: "MainSchedule", params: { date: newVal } })
  }
)

function closePanel() {
  travelStore.placeDetail = null
  travelStore.nowScheduleId = null
}

async function searchTextHandler(searchText) {
  const res = await travelStore.placeSearch(searchText)
}

function updateTime(args) {
  const parmasKey = args[0] // addScheDuleParams or editScheDuleParams ... 
  const { startTime, endTime } = args[1]
  travelStore[parmasKey].start_time = startTime
  travelStore[parmasKey].end_time = endTime
}

function addLocateToSchedule() {
  travelStore.addScheDuleParams.place_id = travelStore.placeDetail.place_id
  travelStore.addScheDuleParams.place_name = travelStore.placeDetail.name
  travelStore.addScheDuleParams.title = travelStore.placeDetail.name
  travelStore.addScheDuleParams.location = travelStore.placeDetail.location

  travelStore.isAddScheduleBoxOpen = true
}

async function addPlaceCollection() {
  const result = await travelStore.addPlaceCollection()
}

async function removePlaceCollection(collectId) {
  const result = await travelStore.removePlaceCollection(collectId)
}

async function confirmdelete() {
  const result = await travelStore.deleteSingleSchedule()
  travelStore.isDeleteScheduleBoxOpen = false
}

onMounted(async () => {
  console.log("mainSchedule page mounted");
  // 根據網址設定參數
  travelStore.nowMainScheduleId = route.params.mainScheduleId
  travelStore.nowSelectDate = route.params.date
  // 先設定好新增行程的 main_schedule_id 參數
  travelStore.addScheDuleParams.main_schedule_id = route.params.mainScheduleId
  const getMainFirstDate = await travelStore.getMainSchedule()

})

onBeforeUnmount(() => {
  travelStore.unMountMainSchedulePage()
})

</script>

<template>
  <!-- 左側行程面板 -->
  <!-- @mouseenter="travelStore.isMenuOpen = true" -->
  <div v-if="mainScheduleInfo" class="flex relative">
    <div :class="{ 'left-0': isMenuOpen, '-left-[288px]': !isMenuOpen }"
      class="sidebar-menu-schedule lg:left-0 border-travel-textgreen w-[300px] lg:w-[400px] bg-white z-10">
      <div class="relative w-full h-full pt-[37px] px-[40px] overflow-y-scroll no-scrollbar">
        <SearchPlace @searchTextHandler="searchTextHandler"></SearchPlace>
        <h2 class="mb-[8px] text-travel-textgreen text-[24px]">{{ mainScheduleInfo.title }}</h2>
        <!-- 天數列表 -->
        <ScheduleDates v-model:selectDate="nowSelectDate"></ScheduleDates>
        <!-- 行程列表 -->
        <ScheduleList>
        </ScheduleList>

        <!-- sidebar-trigger -->
        <button @click="travelStore.toggleMenu"
          class="sidebar-trigger lg:hidden top-[236px] text-travel-gold bg-travel-textgreen">
          {{ isMenuOpen ? "收起行程" : "展開行程" }}
        </button>
      </div>
    </div>
    <!-- 地點詳細資訊面板 -->
    <PlaceDetailPanel :placeDetail="placeInfoComputed" @addLocateToSchedule="addLocateToSchedule"
      @addPlaceCollection="addPlaceCollection" @removePlaceCollection="removePlaceCollection" @closePanel="closePanel">
    </PlaceDetailPanel>
    <!-- 地圖 -->
    <div class="w-screen lg:w-[calc(100vw-400px)] h-[calc(100vh-54px)]">
      <Map :scheduleList="nowDateScheduleList" :locationSearchList="locationSearchList" :placeDetail="placeInfoComputed"
        :directions="directions" :placeCollectionsList="placeCollectionsList" @closePanel="closePanel"></Map>
    </div>
  </div>

  <!-- 新增表單 -->
  <AddScheduleForm></AddScheduleForm>

  <!-- 編輯表單 -->
  <EditScheduleForm></EditScheduleForm>

  <!-- 確認刪除 -->
  <LightBox v-model:isBoxOpen="isDeleteScheduleBoxOpen">
    <template v-slot:title>刪除行程</template>
    <template v-slot:submit-btn>
      <button @click="confirmdelete" class="lightbox-submit-btn bg-alert">刪除</button>
    </template>
    <template v-slot:main>
      <div>確定要刪除行程？</div>
    </template>
  </LightBox>
</template>