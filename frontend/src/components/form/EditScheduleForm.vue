<script setup>
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
const { isEditScheduleBoxOpen, editScheDuleParams, nowScheduleStartTime } = storeToRefs(travelStore)

const { errors } = useInputValidator()
const canBeEmptyKeys = ["place_name"]
const { isSubmitBtnDisabled } = useSubmitBtnState(travelStore.editScheDuleParams, errors, canBeEmptyKeys)

function updateTime(args) {
  console.log("args", args);
  const parmasKey = args[0] // addScheDuleParams or editScheDuleParams ... 
  const startTime = args[1]
  travelStore[parmasKey].start_time = startTime
  // const { startTime, endTime } = args[1]
  // travelStore[parmasKey].start_time = startTime
  // travelStore[parmasKey].end_time = endTime
}

async function updateSingleSchedule() {
  const result = await travelStore.updateSingleSchedule()
  if (result) {
    // get all single schedules under now main schedule
    travelStore.isEditScheduleBoxOpen = false
  }
}

</script>

<template>
  <LightBox v-model:isBoxOpen="travelStore.isEditScheduleBoxOpen">
    <template v-slot:title>編輯行程</template>
    <template v-slot:submit-btn>
      <button :disabled="isSubmitBtnDisabled" @click="updateSingleSchedule" :class="{ 'bg-disabled': isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled }" class="lightbox-submit-btn" type="button">儲存行程</button>
    </template>
    <template v-slot:main>
      <div class="mb-3">
        <!-- <label for="title" class="block mb-1">行程名稱</label> -->
        <!-- <input v-model="editScheDuleParams.title" type="text" class="border w-full px-2 py-1"> -->
        <InputTitle v-model:title="travelStore.editScheDuleParams.title"></InputTitle>
      </div>
      <div class="mb-3">
        <label class="label">日期</label>
        <!-- 天數列表 -->
        <ScheduleDates v-model:selectDate="editScheDuleParams.date" v-model:dayOrder="editScheDuleParams.day_order">
        </ScheduleDates>
      </div>
      <div class="mb-3">
        <label class="label">起始時間</label>
        <!-- :timeRange="nowScheduleTimeRange" -->
        <DatePickerWrap @updateTime="(...args) => updateTime(['editScheDuleParams', ...args])"
        :startTime="nowScheduleStartTime" :timePicker="true">
        </DatePickerWrap>
      </div>
      <div class="mb-3">
        <div>地點</div>
        <div>{{ editScheDuleParams.place_name }}</div>
      </div>
    </template>
  </LightBox>
</template>