<script setup>
import { onMounted, reactive, watch } from "vue";
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import InputScheduleBanner from "@/components/form/InputScheduleBanner.vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import LightBox from "@/components/common/LightBox.vue"
import InputTitle from "@/components/form/InputTitle.vue";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue"
import { dateHandler } from "@/utils/dateTransform"
import DefaultImage from "@/components/common/DefaultImage.vue"


const travelStore = useTravelStore()
const { isEditMainScheduleBoxOpen, editMainScheduleParams, editMainSchedulePicture, mainScheduleInfo } = storeToRefs(travelStore)

watch(
  isEditMainScheduleBoxOpen,
  (newVal) => {
    travelStore.setEditMainScheduleParams()
  }
)

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(travelStore.editMainScheduleParams, errors)

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
  // memberStore.avatarFile = formParams.avatar
  // await memberStore.updateAvatar()
  // memberStore.isEditBoxOpen = false
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
        <InputScheduleBanner v-model:picture="travelStore.editMainSchedulePicture"
          v-model:deletePicture="travelStore.editMainScheduleParams.deletePicture"
          :pictureUrl="mainScheduleInfo.picture" :isBoxOpen="travelStore.isEditMainScheduleBoxOpen">
        </InputScheduleBanner>
      </div>
    </template>
    <template v-slot:main>
      <!-- <pre>{{ editMainSchedulePicture }}</pre> -->
      <!-- <pre>{{ editMainScheduleParams }}</pre> -->
      <form @submit.prevent class="w-full h-full flex flex-col items-start" novalidate>
        <InputTitle v-model:title="travelStore.editMainScheduleParams.title"></InputTitle>
        <div class="w-full">
          <label class="block py-1">日期區間</label>
          <DatePickerWrap @updateDate="updateDate"
            :nowRange="[editMainScheduleParams.startDateObj, editMainScheduleParams.endDateObj]"
            :durationDays="travelStore.editMainScheduleParams.durationDays">
          </DatePickerWrap>
        </div>
      </form>
    </template>
  </LightBox>
</template>