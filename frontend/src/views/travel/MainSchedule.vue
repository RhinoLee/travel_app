<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
import Map from "@/components/map/Map.vue"
import SearchPlace from "@/components/map/SearchPlace.vue"
import PlaceDetailPanel from "@/components/map/PlaceDetailPanel.vue"
import ScheduleList from "@/components/travel/ScheduleList.vue"
import LightBox from "@/components/common/LightBox.vue"
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";

const travelStore = useTravelStore()
const { nowMainScheduleId, mainScheduleInfo, addScheDuleParams, locationSearchList, singleScheduleSelectList, nowSelectSchedule, nowSelectDate, placeDetail } = storeToRefs(travelStore)

const route = useRoute()
const openBox = ref(false)

function hideBox() {
  openBox.value = false
}

function closePanel() {
  travelStore.placeDetail = null
  travelStore.nowSingleScheduleId = null
}

async function searchTextHandler(searchText) {
  const res = await travelStore.placeSearch(searchText)
}

function updateTime({ startTime, endTime }) {
  travelStore.addScheDuleParams.start_time = startTime
  travelStore.addScheDuleParams.end_time = endTime
}

function addLocateToSchedule() {
  travelStore.addScheDuleParams.place_id = travelStore.placeDetail.place_id
  travelStore.addScheDuleParams.place_name = travelStore.placeDetail.name
  travelStore.addScheDuleParams.title = travelStore.placeDetail.name
  travelStore.addScheDuleParams.location = travelStore.placeDetail.location
  openBox.value = true
}

async function addSingleSchedule() {
  const result = await travelStore.addSingleSchedule()
  if (result) {
    // get all single schedules under now main schedule
    await travelStore.getSingleSchedule()
    hideBox()
  }
}

onMounted(() => {
  travelStore.nowMainScheduleId = route.params.mainScheduleId
  travelStore.addScheDuleParams.main_schedule_id = route.params.mainScheduleId
  travelStore.getMainSchedule()
})
</script>

<template>
  <div>
    <div class="flex relative">
      <!-- 左側面板 -->
      <div class="relative w-[30%] h-screen overflow-scroll bg-sky-800 no-scrollbar
      ">
        <div class="px-[20px]">
          <SearchPlace class="mt-8" @searchTextHandler="searchTextHandler"></SearchPlace>
          <h1 class="font-bold mb-[20px] mt-[40px] text-white">{{ mainScheduleInfo.title }}</h1>
          <!-- 天數列表 -->
          <select v-model="nowSelectDate" class="w-full py-1 px-2 outline-none">
            <option value="">總旅程</option>
            <!-- {{ schedule.day }} -->
            <option v-for="(schedule, idx) in singleScheduleSelectList" :key="idx" :value="schedule.date">{{ schedule.date }} </option>
          </select>

          <!-- <pre>{{ nowSelectSchedule.scheduleList }}</pre> -->
          <ScheduleList :singleScheduleList="nowSelectSchedule.scheduleList"></ScheduleList>
        </div>
      </div>
      <!-- 詳細資訊面板 -->
      <PlaceDetailPanel :placeDetail="placeDetail" @addLocateToSchedule="addLocateToSchedule" @closePanel="closePanel"></PlaceDetailPanel>
      <!-- 地圖 -->
      <div class="w-[70%] h-screen">
        <Map :scheduleList="nowSelectSchedule.scheduleList" :locationSearchList="locationSearchList" :placeDetail="placeDetail"></Map>
      </div>
    </div>

    <LightBox :openBox="openBox" @hideBox="hideBox">
      <template v-slot:header>新增行程</template>
      <template v-slot:main>
        <div class="mb-3">
          <label for="title" class="block mb-1">行程名稱</label>
          <input v-model="addScheDuleParams.title" type="text" class="border w-full px-2 py-1">
        </div>
        <div class="mb-3">
          <label class="block mb-1">選擇日期</label>
          <select v-model="addScheDuleParams.date" class="w-full border py-2 px-2 outline-none" id="date">
            <option :value="null">選擇日期</option>
            <option v-for="day in mainScheduleInfo.daysList" :key="day.date" :value="day.date">{{ day.date
            }} {{ day.day }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block mb-1">選擇時間區間</label>
          <DatePickerWrap @updateTime="updateTime" :timePicker="true"></DatePickerWrap>
        </div>
        <div class="mb-3">
          <div>地點</div>
          <div v-if="placeDetail">{{ placeDetail.name }}</div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button @click="addSingleSchedule" class="border px-4 py-2">儲存行程</button>
        </div>
      </template>
    </LightBox>
  </div>
</template>