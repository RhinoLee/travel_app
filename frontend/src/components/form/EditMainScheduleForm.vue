<script setup>
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import { dateHandler } from "@/utils/dateTransform"


const travelStore = useTravelStore()
const { isEditMainScheduleBoxOpen, editMainScheduleParams, editMainSchedulePicture, mainScheduleInfo } = storeToRefs(travelStore)
watch(
  isEditMainScheduleBoxOpen,
  (newVal) => {
    travelStore.setEditMainScheduleParams()
  }
)

const { errors } = useInputValidator()
const canBeEmptyKeys = ["deletePicture", "picture", "durationDays"]
const { isSubmitBtnDisabled } = useSubmitBtnState(travelStore.editMainScheduleParams, errors, canBeEmptyKeys)

function hideBox() {

}

function updateDate({ startDate, endDate }) {
  travelStore.editMainScheduleParams.startDateObj = dateHandler.dateFormatDate(startDate)
  travelStore.editMainScheduleParams.endDateObj = dateHandler.dateFormatDate(endDate)
  travelStore.editMainScheduleParams.startDate = startDate
  travelStore.editMainScheduleParams.endDate = endDate
}

async function updateMainSchedule() {
  const result = await travelStore.updateMainSchedule()
  travelStore.isEditMainScheduleBoxOpen = false
}

</script>

<template>
  <LightBox v-model:isBoxOpen="travelStore.isEditMainScheduleBoxOpen">
    <template v-slot:title>編輯行程</template>
    <template v-slot:submit-btn>
      <button :disabled="isSubmitBtnDisabled" @click="updateMainSchedule"
        :class="{ 'bg-disabled': isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled }"
        class="lightbox-submit-btn" type="button">儲存</button>
    </template>
    <template v-slot:banner>
      <!-- 圖片 -->
      <div>
        <!-- <DefaultImage></DefaultImage> -->
        <InputScheduleBanner v-model:picture="travelStore.editMainScheduleParams.picture"
          v-model:deletePicture="travelStore.editMainScheduleParams.deletePicture"
          :pictureUrl="mainScheduleInfo.picture" :isBoxOpen="travelStore.isEditMainScheduleBoxOpen">
        </InputScheduleBanner>
      </div>
    </template>
    <template v-slot:main>
      <form @submit.prevent class="form" novalidate>
        <InputTitle v-model:title="travelStore.editMainScheduleParams.title"></InputTitle>
        <div class="w-full">
          <label class="label">日期區間</label>
          <DatePickerWrap @updateDate="updateDate"
            :nowRange="[editMainScheduleParams.startDateObj, editMainScheduleParams.endDateObj]"
            :durationDays="travelStore.editMainScheduleParams.durationDays">
          </DatePickerWrap>
        </div>
      </form>
    </template>
  </LightBox>
</template>