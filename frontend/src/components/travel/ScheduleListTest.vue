<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from "pinia";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";
import draggable from 'vuedraggable'

const props = defineProps({
  singleScheduleList: {
    type: Array
  }
})

const emit = defineEmits(["editLocateToSchedule"])

const travelStore = useTravelStore()
const { nowScheduleId, nowSchedule } = storeToRefs(travelStore)

function selectSchedule(scheduleId, date) {
  travelStore.nowScheduleId = scheduleId
  travelStore.nowScheduleDate = date
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

// drag & drop
function dragStartHandler(e, schedule, date) {
  console.log("dragStartHandler date", date);
  const { id, start_time, end_time } = schedule
  e.dataTransfer.dropEffect = "move"
  e.dataTransfer.effectAllowed = "move"
  e.dataTransfer.setData("scheduleId", id)
  e.dataTransfer.setData("scheduleDate", date)
  e.dataTransfer.setData("scheduleStartTime", start_time)
  e.dataTransfer.setData("scheduleEndTime", end_time)
}

function dropHandler(e, schedule, date) {
  const dragId = e.dataTransfer.getData("scheduleId") * 1
  const dragDate = e.dataTransfer.getData("scheduleDate")
  // const position = e.dataTransfer.getData("position")
  const { id, start_time, end_time } = schedule
  const dropId = id * 1
  const dropDate = date

  console.log(position, schedule.title);
  // travelStore.exchangeSchedule(dragId, dragDate, dropId, dropDate)
}

</script>

<template>
  <div>
    <!-- <pre>{{ nowSchedule }}</pre> -->
    <div v-for="singleSchedule in props.singleScheduleList" :key="singleSchedule.date"
      class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ singleSchedule.date }}</span>
      </div>
      <!-- @dragenter.prevent  -->
      <!-- @dragover.prevent -->
      <div v-for="(schedule, idx) in singleSchedule.scheduleList" :key="idx" class="min-h-[118px]"
        @drop="dropHandler($event, schedule, singleSchedule.date)" @dragenter.prevent @dragover.prevent>
        <div class="px-[14px] py-[10px] mt-[10px] cursor-pointer hover:bg-sky-900 relative schedule"
          :class="{ 'bg-sky-900': nowScheduleId === schedule.id }"
          @click="getLocationInfo(schedule.place_id, schedule.id, singleSchedule.date)"
          @dragstart="dragStartHandler($event, schedule, singleSchedule.date)" 
          draggable="true">
          <div class="flex justify-between items-center"
        >
            <div>
              <span>時間區間：</span>
              <span>{{ schedule.start_time }} - {{ schedule.end_time }}</span>
            </div>
            <div @click.stop="deleteSingleSchedule(schedule.id, singleSchedule.date)" class="border px-1 text-sm">X
            </div>
          </div>
          <div class="mt-2">
            <span>行程：</span>
            <span>{{ schedule.title }}</span>
          </div>
          <!-- <div class="mt-2">
          <span>地點：</span>
          <span>{{ schedule.place_name }}</span>
        </div> -->

          <button @click.stop="editLocateToSchedule(schedule.id, singleSchedule.date)"
            class="border px-3 py-1 mt-2">編輯行程</button>
          <!-- <div>
          <span>筆記：</span>
          <span>{{ schedule.note }}</span>
        </div> -->
        </div>

      </div>
    </div>

  </div>
</template>