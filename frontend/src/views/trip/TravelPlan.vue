<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
import Map from "@/components/map/Map.vue"
import SearchPlace from "@/components/common/SearchPlace.vue"

const travelStore = useTravelStore()
const { nowSelectPlan, nowPlanDates } = storeToRefs(travelStore)

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
    <div class="flex text-white">
      <!-- 左側面板 -->
      <div class="relative w-[30%] h-screen overflow-scroll bg-sky-700/50 no-scrollbar
      after:absolute after:left-0 after:top-0 after:w-full after:h-full after:block after:bg-black after:-z-10
      ">
        <div class="px-[20px] pt-[30px]">
          <!-- <SearchPlace @searchTextHandler="searchTextHandler"></SearchPlace> -->
          <h1 class="font-bold mb-[20px] mt-[40px]">{{ nowSelectPlan.title }}</h1>
          <!-- 天數列表 -->
          <div v-for="plan in nowSelectPlan.planOfTravel" :key="plan.id" @click="travelStore.getDayPlan(plan.id)">
            {{ plan.date }}
          </div>

          <!-- <div>
            <div v-for="plan in nowSelectPlan.planOfTravel" :key="plan.id">
              <pre>{{ plan }}</pre>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 地圖 -->
      <div class="w-[70%] h-screen">
        <Map :planOfTravel="nowSelectPlan.planOfTravel"></Map>
      </div>
    </div>


  </div>
</template>