<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
const travelStore = useTravelStore()
const props = defineProps({
  nowDailyPlanList: {
    type: Array
  }
})

const nowPlanId = ref(null)

function selectPlan(planId) {
  nowPlanId.value = planId
}

async function getLocationInfo(placeId, planId) {
  selectPlan(planId)
  const res = await travelStore.getLocationInfo(placeId)
}

</script>

<template>
  <div>
    <!-- <pre>{{ nowDailyPlanList }}</pre> -->
    <div v-for="dailyPlan in props.nowDailyPlanList" :key="dailyPlan.id" class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ dailyPlan.date }}</span>
      </div>
      <div 
        v-for="(plan, idx) in dailyPlan.plans" :key="idx" 
        class="px-[10px] py-[10px] mt-[10px] cursor-pointer hover:bg-sky-900"
        :class="{ 'bg-sky-900': nowPlanId === plan.id }"
        @click="getLocationInfo(plan.placeId, plan.id)"
      >
        <div>
          <span>時間區間：</span>
          <span>{{ plan.startTime }} - {{ plan.endTime }}</span>
        </div>
        <div>
          <span>行程：</span>
          <span>{{ plan.title }}</span>
        </div>
        <div>
          <span>地點：</span>
          <span>{{ plan.placeName }}</span>
        </div>
        <div>
          <span>筆記：</span>
          <span>{{ plan.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>