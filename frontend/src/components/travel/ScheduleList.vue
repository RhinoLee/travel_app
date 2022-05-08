<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from "pinia";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";
import draggable from 'vuedraggable'

const emit = defineEmits(["editLocateToSchedule"])

const travelStore = useTravelStore()
const { nowSingleScheduleId, nowSelectSingleSchedule, singleScheduleList, nowSelectSchedule } = storeToRefs(travelStore)
const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: "ghost"
}
const drag = ref(false)

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

// drag & drop
function dragStartHandler(e) {
  drag.value = true
}

function dropHandler(e) {
  drag.value = false
}

async function change({ moved }) {
  const moveResult = travelStore.exchangeSchedule(moved)
  if (moveResult) {
    await travelStore.updateSingleScheduleGroup(moved.element.date)
  }
}

</script>

<template>
  <div>
    <!-- singleScheduleList -->
    <div v-for="singleSchedule in nowSelectSchedule" :key="singleSchedule.date" class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ singleSchedule.date }}</span>
      </div>

      <draggable v-model="singleSchedule.scheduleList" 
        @start="dragStartHandler" 
        @end="dropHandler"
        @change="change"
        item-key="id"
        v-bind="dragOptions"
        :group="`schedule${singleSchedule.date}`"
        handle=".handle"
      >
        <template #item="{ element }">
          <div class="px-[14px] py-[10px] mt-[10px] cursor-pointer hover:bg-sky-900 relative schedule"
            :class="{ 'bg-sky-900': nowSingleScheduleId === element.id }"
            @click="getLocationInfo(element.place_id, element.id, singleSchedule.date)">
            <div><i class="handle">hand</i></div>
            <div>
              <div class="flex justify-between items-center">
                <div>
                  <span>時間區間：</span>
                  <span>{{ element.start_time }} - {{ element.end_time }}</span>
                </div>
                <div @click.stop="deleteSingleSchedule(element.id, singleSchedule.date)" class="border px-1 text-sm">X
                </div>
              </div>
              <div class="mt-2">
                <span>行程：</span>
                <span>{{ element.title }}</span>
              </div>

              <button @click.stop="editLocateToSchedule(element.id, singleSchedule.date)"
                class="border px-3 py-1 mt-2">編輯行程</button>
            </div>
          </div>
        </template>
      </draggable>

      
    </div>
  </div>
</template>