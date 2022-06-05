<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from "pinia";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";
import TrafficTime from "@/components/travel/TrafficTime.vue"
import draggable from 'vuedraggable'
import dragIcon from "@/assets/images/svg/icon_drag.svg"
import editIcon from "@/assets/images/svg/icon_edit.svg"
import cancelIcon from "@/assets/images/svg/icon_cancel_gray.svg"

const travelStore = useTravelStore()
const { nowScheduleId, nowDateScheduleList, directions } = storeToRefs(travelStore)
const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: "ghost"
}
const drag = ref(false)

async function getLocationInfo(placeId, scheduleId, date) {
  travelStore.selectSchedule(scheduleId, date)
  const res = await travelStore.getLocationInfo(placeId)
}

function editLocateToSchedule(scheduleId, date) {
  travelStore.selectSchedule(scheduleId, date)
  travelStore.setEditScheduleParams()
  travelStore.isEditScheduleBoxOpen = true
}

function deleteSingleSchedule(scheduleId, date) {
  travelStore.selectSchedule(scheduleId, date)
  travelStore.isDeleteScheduleBoxOpen = true
}

// drag & drop
function dragStartHandler(e) {
  drag.value = true
}

function dropHandler(e) {
  drag.value = false
}

async function changeHandler({ moved }) {
  const moveResult = travelStore.exchangeSchedule(moved)
}

</script>

<template>
  <div v-for="singleSchedule in nowDateScheduleList" :key="singleSchedule.date">
    <draggable v-model="singleSchedule.scheduleList" @start="dragStartHandler" @end="dropHandler"
      @change="changeHandler" item-key="id" v-bind="dragOptions" :group="`schedule${singleSchedule.date}`"
      handle=".handle">
      <!-- 每一筆行程 item  -->
      <template #item="{ element, index }">
        <div class="schedule relative">
          <div @click="getLocationInfo(element.place_id, element.id, singleSchedule.date)"
            :class="{ 'bg-travel-lightgreen': nowScheduleId === element.id }"
            class="flex items-center border-y border-travel-lightgreen px-[5px] py-[22px] cursor-pointer hover:bg-travel-lightgreen">
            <!-- drag-icon -->
            <div class="handle flex justify-center w-[20px] h-full"><img :src="dragIcon"
                class="w-[12px] h-[24px] object-cover object-center pointer-events-none"></div>
            <!-- 行程時間 & 名稱 -->
            <div class="w-[calc(100%-46px)] lg:w-[calc(100%-75px)] pl-[12px]">
              <div class="flex justify-between items-center">
                <div class="child:text-travel-textgreen child:text-[14px] lg:child:text-[16px] child:tracking-wider">
                  <span>{{ element.start_time }}</span>
                  <span v-if="element.end_time"> - {{ element.end_time }}（最晚）</span>
                </div>
              </div>
              <div class="mt-[7px] child:text-[16px] child:tracking-wider">
                <!-- <span>行程：</span> -->
                <span>{{ element.title }}</span>
              </div>
            </div>
            <!-- 編輯 & 刪除按鈕 -->
            <div class="flex flex-col-reverse w-[24px] lg:w-[53px] lg:flex-row lg:ml-0">
              <button @click.stop="editLocateToSchedule(element.id, singleSchedule.date)"
                class="mt-[8px] w-[24px] h-[24px] lg:mt-0" type="button"><img
                  class="w-full h-full object-cover object-center" :src="editIcon" alt="編輯"></button>
              <button @click.stop="deleteSingleSchedule(element.id, singleSchedule.date)"
                class="lg:ml-[5px] w-[24px] h-[24px]" type="button">
                <img class="w-full h-full object-cover object-center" :src="cancelIcon" alt="刪除">
              </button>
            </div>
          </div>

          <!-- 路程距離 & 時間 -->
          <div v-if="element.end_time && directions.durations[index]" class="py-2 px-4">
            <TrafficTime :duration="directions.durations[index].text" :distance="directions.distances[index].text">
            </TrafficTime>
          </div>

        </div>
      </template>
    </draggable>


  </div>
</template>