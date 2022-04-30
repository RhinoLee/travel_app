<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from "pinia";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";

const props = defineProps({
  singleScheduleList: {
    type: Array
  }
})

const emit = defineEmits(["editLocateToSchedule"])

const travelStore = useTravelStore()
const { nowSingleScheduleId, nowSelectSingleSchedule } = storeToRefs(travelStore)

function selectSchedule(scheduleId, date) {
  travelStore.nowSingleScheduleId = scheduleId
  travelStore.nowSingleScheduleDate = date
}

async function getLocationInfo(placeId, scheduleId, date) {
  selectSchedule(scheduleId, date)
  const res = await travelStore.getLocationInfo(placeId)
}

function editLocateToSchedule(scheduleId, date) {
  selectSchedule(scheduleId, date)
  emit("editLocateToSchedule")
}

function deleteSingleSchedule(scheduleId, date) {
  selectSchedule(scheduleId, date)
  emit("deleteSingleSchedule")
}

</script>

<template>
  <div>
    <!-- <pre>{{ nowSelectSingleSchedule }}</pre> -->
    <div v-for="singleSchedule in props.singleScheduleList" :key="singleSchedule.date" class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ singleSchedule.date }}</span>
      </div>
      <div 
        v-for="(schedule, idx) in singleSchedule.scheduleList" :key="idx" 
        class="px-[14px] py-[10px] mt-[10px] cursor-pointer hover:bg-sky-900"
        :class="{ 'bg-sky-900': nowSingleScheduleId === schedule.id }"
        @click="getLocationInfo(schedule.place_id, schedule.id, singleSchedule.date)"
      >
        <div class="flex justify-between items-center">
          <div>
            <span>時間區間：</span>
            <span>{{ schedule.start_time }} - {{ schedule.end_time }}</span>
          </div>
          <div @click.stop="deleteSingleSchedule(schedule.id, singleSchedule.date)" class="border px-1 text-sm">X</div>
        </div>
        <div  class="mt-2">
          <span>行程：</span>
          <span>{{ schedule.title }}</span>
        </div>
        <div class="mt-2">
          <span>地點：</span>
          <span>{{ schedule.place_name }}</span>
        </div>

        <button @click.stop="editLocateToSchedule(schedule.id, singleSchedule.date)" class="border px-3 py-1 mt-2">編輯行程</button>
        <!-- <div>
          <span>筆記：</span>
          <span>{{ schedule.note }}</span>
        </div> -->
      </div>
    </div>

  </div>
</template>