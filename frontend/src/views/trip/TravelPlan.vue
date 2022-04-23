<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
import Map from "@/components/map/Map.vue"
import SearchPlace from "@/components/common/SearchPlace.vue"
import PlaceDetailPanel from "@/components/map/PlaceDetailPanel.vue"
import DailyPlanInfo from "@/components/travel/DailyPlanInfo.vue"

const travelStore = useTravelStore()
const { nowPlanInfo, nowDailyPlanId, dailyPlanSelectList, nowDailyPlan, placeDetail } = storeToRefs(travelStore)

const route = useRoute()
const planId = ref(null)

async function searchTextHandler(searchText) {
  const res = await travelStore.placeSearch(searchText)
}

onMounted(() => {
  planId.value = route.params.planId
  console.log("planId", route.params.planId);
})
</script>

<template>
  <div>
    <div class="flex relative">
      <!-- 左側面板 -->
      <div class="relative w-[30%] h-screen overflow-scroll bg-sky-800 no-scrollbar
      ">
        <div class="px-[20px]">
          <!-- <SearchPlace @searchTextHandler="searchTextHandler"></SearchPlace> -->
          <h1 class="font-bold mb-[20px] mt-[40px] text-white">{{ nowPlanInfo.title }}</h1>
          <!-- 天數列表 -->
          <select v-model="nowDailyPlanId" class="w-full py-1 px-2 outline-none">
            <option :value="null">總旅程</option>
            <option v-for="plan in dailyPlanSelectList" :key="plan.dailyPlanId" :value="plan.dailyPlanId">{{ plan.date }} {{ plan.day }}</option>
          </select>

          <!-- <pre>{{ nowDailyPlan.planList }}</pre> -->
          <DailyPlanInfo :nowDailyPlanList="nowDailyPlan.planList"></DailyPlanInfo>
        </div>
      </div>
      <!-- 詳細資訊面板 -->
      <PlaceDetailPanel :placeDetail="placeDetail"></PlaceDetailPanel>
      <!-- 地圖 -->
      <div class="w-[70%] h-screen">
        <Map :planList="nowDailyPlan.planList"></Map>
      </div>
    </div>


  </div>
</template>