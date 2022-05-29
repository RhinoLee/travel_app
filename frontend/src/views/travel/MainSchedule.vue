<script setup>
import { onMounted, onUnmounted, reactive, watch } from "vue";
import { useRoute } from "vue-router"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
import Map from "@/components/map/Map.vue"
import SearchPlace from "@/components/map/SearchPlace.vue"
import PlaceDetailPanel from "@/components/map/PlaceDetailPanel.vue"
import ScheduleList from "@/components/travel/ScheduleList.vue"
import ScheduleDates from "@/components/travel/ScheduleDates.vue"
import LightBox from "@/components/common/LightBox.vue"
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";

const travelStore = useTravelStore()
const { nowMainScheduleId, mainScheduleInfo, addScheDuleParams, editScheDuleParams, locationSearchList, nowDateScheduleList, directions, placeCollectionsList, placeInfoComputed, durationDateList, nowScheduleTime, nowSelectDate } = storeToRefs(travelStore)

const route = useRoute()
const lightbox = reactive({ createBox: false, editBox: false, deleteBox: false })

watch(
  nowSelectDate,
  (newVal) => {
    travelStore.cancelSelectSchedule()
  }
)

function hideBox(boxname) {
  lightbox[boxname] = false
}

function openBox(boxname) {
  lightbox[boxname] = true
}

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

  openBox("createBox")
}

async function addPlaceCollection() {
  const result = await travelStore.addPlaceCollection()
}

async function removePlaceCollection(collectId) {
  const result = await travelStore.removePlaceCollection(collectId)
}

function editLocateToSchedule() {
  travelStore.setEditScheduleParams()
  openBox("editBox")
}

async function addSingleSchedule() {
  const result = await travelStore.addSingleSchedule()
  if (result) {
    // get all single schedules under now main schedule
    await travelStore.getMainSchedule()
    hideBox("createBox")
  }
}

async function updateSingleSchedule() {
  const result = await travelStore.updateSingleSchedule()
  if (result) {
    // get all single schedules under now main schedule
    hideBox("editBox")
  }
}

async function deleteSingleSchedule() {
  openBox("deleteBox")
}

async function confirmdelete() {
  const result = await travelStore.deleteSingleSchedule()
  hideBox("deleteBox")
}

onMounted(async () => {
  travelStore.nowMainScheduleId = route.params.mainScheduleId
  travelStore.addScheDuleParams.main_schedule_id = route.params.mainScheduleId
  const getPlaceCollectionsResult =  await travelStore.getPlaceCollections()
  const getMainResult = await travelStore.getMainSchedule()
})

onUnmounted(() => {
  Object.keys(lightbox).forEach(key => {
    lightbox[key] = false
  })
})

</script>

<template>
  <div>
    <div v-if="mainScheduleInfo" class="flex relative">
      <!-- 左側行程面板 -->
      <div class="relative w-[30%] lg:max-w-[380px] h-screen border-r-[2px] border-travel-green px-[25px] bg-white overflow-scroll no-scrollbar
      ">
        <div>
          <SearchPlace class="mt-8" @searchTextHandler="searchTextHandler"></SearchPlace>
          <h2 class="mb-[8px] text-travel-textgreen text-[24px]">{{ mainScheduleInfo.title }}</h2>
          <!-- 天數列表 -->
          <ScheduleDates v-model:selectDate="nowSelectDate"></ScheduleDates>
          <!-- 行程列表 -->
          <!-- :singleScheduleList="nowDateScheduleList" -->
          <ScheduleList 
            @editLocateToSchedule="editLocateToSchedule" 
            @deleteSingleSchedule="deleteSingleSchedule"
          >
          </ScheduleList>
        </div>
      </div>
      <!-- 地點詳細資訊面板 -->
      <PlaceDetailPanel 
        :placeDetail="placeInfoComputed"
        @addLocateToSchedule="addLocateToSchedule" 
        @addPlaceCollection="addPlaceCollection" 
        @removePlaceCollection="removePlaceCollection" 
        @closePanel="closePanel"
      >
      </PlaceDetailPanel>
      <!-- 地圖 -->
      <div class="w-[70%] lg:w-full lg:max-w-[calc(100%-380px)] h-screen">
        <Map :scheduleList="nowDateScheduleList" :locationSearchList="locationSearchList"
          :placeDetail="placeInfoComputed" :directions="directions" @closePanel="closePanel" :placeCollectionsList="placeCollectionsList"></Map>
      </div>
    </div>

    <!-- 新增表單 -->
    <LightBox v-model:isBoxOpen="lightbox.createBox">
      <template v-slot:title>新增行程</template>
      <template v-slot:main>
        <div class="mb-3">
          <label for="title" class="block mb-1">行程名稱</label>
          <input v-model="addScheDuleParams.title" type="text" class="border w-full px-2 py-1">
        </div>
        <div class="mb-3">
          <label class="block mb-1">選擇日期</label>
          <ScheduleDates v-model:selectDate="addScheDuleParams.date" v-model:dayOrder="addScheDuleParams.day_order"></ScheduleDates>
          <!-- <select v-model="addScheDuleParams.date" class="w-full border py-2 px-2 outline-none" id="date">
            <option :value="null">選擇日期</option>
            <option v-for="day in mainScheduleInfo.daysList" :key="day.date" :value="day.date">{{ day.date
            }} {{ day.day }}</option>
          </select> -->
        </div>
        <div class="mb-3">
          <label class="block mb-1">選擇時間區間</label>
          <DatePickerWrap @updateTime="(...args) => updateTime(['addScheDuleParams', ...args])" :timePicker="true">
          </DatePickerWrap>
        </div>
        <div class="mb-3">
          <div>地點</div>
          <div v-if="placeInfoComputed">{{ placeInfoComputed.name }}</div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button @click="addSingleSchedule" class="border px-4 py-2">儲存行程</button>
        </div>
      </template>
    </LightBox>

    <!-- 編輯表單 -->
    <LightBox v-model:isBoxOpen="lightbox.editBox">
      <template v-slot:title>編輯行程</template>
      <template v-slot:main>
        <div class="mb-3">
          <label for="title" class="block mb-1">行程名稱</label>
          <input v-model="editScheDuleParams.title" type="text" class="border w-full px-2 py-1">
        </div>
        <div class="mb-3">
          <label class="block mb-1">選擇日期</label>
          <!-- 天數列表 -->
          <ScheduleDates v-model:selectDate="editScheDuleParams.date" v-model:dayOrder="editScheDuleParams.day_order"></ScheduleDates>
          <!-- <select v-model="editScheDuleParams.date" class="w-full border py-2 px-2 outline-none" id="date">
            <option :value="null">選擇日期</option>
            <option v-for="day in durationDateList" :key="day.date" :value="day.date">{{ day.date
            }} {{ day.day }}</option>
          </select> -->
        </div>
        <div class="mb-3">
          <label class="block mb-1">選擇時間區間</label>
          <DatePickerWrap v-if="nowScheduleTime"
            @updateTime="(...args) => updateTime(['editScheDuleParams', ...args])" :timePicker="true"
            :startTime="nowScheduleTime">
          </DatePickerWrap>
        </div>
        <div class="mb-3">
          <div>地點</div>
          <div>{{ editScheDuleParams.place_name }}</div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button @click="updateSingleSchedule" class="border px-4 py-2">儲存行程</button>
        </div>
      </template>
    </LightBox>

    <!-- 確認刪除 -->
    <LightBox v-model:isBoxOpen="lightbox.deleteBox">
      <template v-slot:title>刪除行程</template>
      <template v-slot:main>
        <div>確定要刪除行程？</div>
      </template>
      <template v-slot:footer>
        <div>
          <button @click="confirmdelete" class="border px-4 py-2">刪除行程</button>
        </div>
      </template>
    </LightBox>

  </div>
</template>