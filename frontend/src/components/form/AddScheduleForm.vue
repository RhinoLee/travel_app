<script setup>
import { watch } from "vue"
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import LightBox from "@/components/common/LightBox.vue"
import InputTitle from "@/components/form/input/InputTitle.vue";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue"
import { dateHandler } from "@/utils/dateTransform"
import DefaultImage from "@/components/common/DefaultImage.vue"
import ScheduleDates from "@/components/travel/ScheduleDates.vue"

const travelStore = useTravelStore()
const { isAddScheduleBoxOpen, addScheDuleParams, placeInfoComputed } = storeToRefs(travelStore)

const { errors } = useInputValidator()
const canBeEmptyKeys = []
const { isSubmitBtnDisabled } = useSubmitBtnState(travelStore.addScheDuleParams, errors, canBeEmptyKeys)

function updateTime(args) {
  const parmasKey = args[0] // addScheDuleParams or editScheDuleParams ... 
  const startTime = args[1]
  travelStore[parmasKey].start_time = startTime
  // const { startTime, endTime } = args[1]
  // travelStore[parmasKey].start_time = startTime
  // travelStore[parmasKey].end_time = endTime
}

async function addSingleSchedule() {
  const result = await travelStore.addSingleSchedule()
  if (result) {
    // get all single schedules under now main schedule
    await travelStore.getMainSchedule()
    await travelStore.getDirections()
    travelStore.isAddScheduleBoxOpen = false
  }
}

</script>

<template>
  <LightBox v-model:isBoxOpen="travelStore.isAddScheduleBoxOpen">
    <template v-slot:title>新增行程</template>
    <template v-slot:submit-btn>
      <button :disabled="isSubmitBtnDisabled" @click="addSingleSchedule"
        :class="{ 'bg-disabled': isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled }"
        class="lightbox-submit-btn" type="button">新增行程</button>
    </template>
    <template v-slot:main>
      <!-- <pre>{{ addScheDuleParams }}</pre> -->
      <div class="mb-3">
        <label for="title" class="block mb-1">行程名稱</label>
        <input v-model="addScheDuleParams.title" type="text" class="border w-full px-2 py-1">
      </div>
      <div class="mb-3">
        <label class="block mb-1">選擇日期</label>
        <ScheduleDates v-model:selectDate="addScheDuleParams.date" v-model:dayOrder="addScheDuleParams.day_order">
        </ScheduleDates>
      </div>
      <div class="mb-3">
        <label class="block mb-1">起始時間</label>
        <DatePickerWrap @updateTime="(...args) => updateTime(['addScheDuleParams', ...args])" :timePicker="true">
        </DatePickerWrap>
      </div>
      <div class="mb-3">
        <div>地點</div>
        <div v-if="placeInfoComputed">{{ placeInfoComputed.name }}</div>
      </div>
    </template>
  </LightBox>
</template>