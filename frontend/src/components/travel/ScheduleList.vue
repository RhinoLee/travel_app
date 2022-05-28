<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from "pinia";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue";
import draggable from 'vuedraggable'
import galleryIcon from "@/assets/images/svg/icon_gallery.svg"

const emit = defineEmits(["editLocateToSchedule"])

const travelStore = useTravelStore()
const { nowScheduleId, allSchedules, nowDateScheduleList } = storeToRefs(travelStore)
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
  emit("editLocateToSchedule")
}

function deleteSingleSchedule(scheduleId, date) {
  travelStore.selectSchedule(scheduleId, date)
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
    <div v-for="singleSchedule in nowDateScheduleList" :key="singleSchedule.date">
      <draggable v-model="singleSchedule.scheduleList" @start="dragStartHandler" @end="dropHandler" @change="change"
        item-key="id" v-bind="dragOptions" :group="`schedule${singleSchedule.date}`" handle=".handle">
        <template #item="{ element }">
          <div class="border-b border-travel-darkgreen px-[14px] py-[22px] cursor-pointer hover:bg-travel-lightgreen relative schedule"
            :class="{ 'bg-travel-lightgreen': nowScheduleId === element.id }"
            @click="getLocationInfo(element.place_id, element.id, singleSchedule.date)">
            <div class="flex items-center">
              <div class="handle w-[24px] h-[24px]"><img :src="galleryIcon"
                  class="w-full h-full object-cover object-center"></div>
              <div class="pl-[12px]">
                <div class="flex justify-between items-center">
                  <div class="child:text-travel-textgreen child:text-[15px] child:tracking-wider">
                    <span>時間區間：</span>
                    <span>{{ element.start_time }} - {{ element.end_time }}</span>
                  </div>
                </div>
                <div class="mt-[7px] child:text-[16px] child:tracking-wider">
                  <span>行程：</span>
                  <span>{{ element.title }}</span>
                </div>

                <button @click.stop="editLocateToSchedule(element.id, singleSchedule.date)"
                  class="border px-3 py-1 mt-2">編輯行程</button>
              </div>
            </div>

            <div @click.stop="deleteSingleSchedule(element.id, singleSchedule.date)"
              class="absolute top-[22px] right-0 border w-[30px] h-[30px] flex items-center justify-center text-sm">
                <span>X</span>
            </div>
          </div>
        </template>
      </draggable>


    </div>
  </div>
</template>