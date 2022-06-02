<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from "pinia";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";
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

async function change({ moved }) {
  // const moveResult = travelStore.exchangeSchedule(moved)
  // if (moveResult) {
  //   await travelStore.updateSingleScheduleGroup(moved.element.date)
  // }
}

</script>

<template>
  <div>
    <div v-for="singleSchedule in nowDateScheduleList" :key="singleSchedule.date">
      <draggable v-model="singleSchedule.scheduleList" @start="dragStartHandler" @end="dropHandler" @change="change"
        item-key="id" v-bind="dragOptions" :group="`schedule${singleSchedule.date}`" handle=".handle">
        <!-- 每一筆行程 item  -->
        <template #item="{ element, index }">
          <div
            class="schedule relative px-[5px] rounded-[5px] overflow-hidden cursor-pointer hover:bg-travel-lightgreen"
            :class="{ 'bg-travel-lightgreen': nowScheduleId === element.id }"
            @click="getLocationInfo(element.place_id, element.id, singleSchedule.date)">
            <div class="flex items-center border-b border-travel-lightgreen py-[22px]">
              <!-- drag-icon -->
              <div class="handle flex justify-center w-[20px] h-full"><img :src="dragIcon"
                  class="w-[12px] h-[24px] object-cover object-center pointer-events-none"></div>
              <!-- 行程時間 & 名稱 -->
              <div class="w-[calc(100%-75px)] pl-[12px]">
                <div class="flex justify-between items-center">
                  <div class="child:text-travel-textgreen child:text-[15px] child:tracking-wider">
                    <span>{{ element.start_time }} - 預估離開：{{ element.end_time }}</span>
                  </div>
                </div>
                <div class="mt-[7px] child:text-[16px] child:tracking-wider">
                  <span>行程：</span>
                  <span>{{ element.title }}</span>
                </div>
              </div>
              <!-- 編輯 & 刪除按鈕 -->
              <div class="w-[53px]">
                <button @click.stop="editLocateToSchedule(element.id, singleSchedule.date)" class="w-[24px] h-[24px]"
                  type="button"><img class="w-full h-full object-cover object-center" :src="editIcon" alt="編輯"></button>
                <button @click.stop="deleteSingleSchedule(element.id, singleSchedule.date)" class="ml-[5px] w-[24px] h-[24px]"
                  type="button">
                  <img class="w-full h-full object-cover object-center" :src="cancelIcon" alt="刪除">
                </button>
              </div>
            </div>

            <!-- 路程距離 & 時間 -->
            <div v-if="element.end_time && directions.durations[index]"
              class="py-2 px-4"
            >
              <p class="text-violet-400">路程時間：{{ directions.durations[index].text }}</p>
              <p class="text-violet-400">路程距離：{{ directions.distances[index].text }}</p>
            </div>
            
          </div>
        </template>
      </draggable>


    </div>
  </div>
</template>