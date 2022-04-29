<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
const travelStore = useTravelStore()
const props = defineProps({
  singleScheduleList: {
    type: Array
  }
})

const nowScheduleDate = ref("")

function selectSchedule(scheduleDate) {
  nowScheduleDate.value = scheduleDate
}

async function getLocationInfo(placeId, scheduleDate) {
  selectSchedule(scheduleDate)
  const res = await travelStore.getLocationInfo(placeId)
}

</script>

<template>
  <div>
    <!-- <pre>{{ singleScheduleList }}</pre> -->
    <div v-for="singleSchedule in props.singleScheduleList" :key="singleSchedule.date" class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ singleSchedule.date }}</span>
      </div>
      <div 
        v-for="(schedule, idx) in singleSchedule.scheduleList" :key="idx" 
        class="px-[10px] py-[10px] mt-[10px] cursor-pointer hover:bg-sky-900"
        :class="{ 'bg-sky-900': nowScheduleDate === schedule.id }"
        @click="getLocationInfo(schedule.place_id, schedule.date)"
      >
        <div>
          <span>時間區間：</span>
          <span>{{ schedule.start_time }} - {{ schedule.end_time }}</span>
        </div>
        <div>
          <span>行程：</span>
          <span>{{ schedule.title }}</span>
        </div>
        <div>
          <span>地點：</span>
          <span>{{ schedule.place_name }}</span>
        </div>
        <!-- <div>
          <span>筆記：</span>
          <span>{{ schedule.note }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>