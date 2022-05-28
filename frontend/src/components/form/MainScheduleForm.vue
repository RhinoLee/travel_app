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
const { nowMainScheduleId, isEditMainScheduleBoxOpen, editMainScheduleParams, editMainSchedulePicture, mainScheduleInfo } = storeToRefs(travelStore)

watch(
  nowMainScheduleId,
  (newVal) => {
    travelStore.setEditMainScheduleParams()
  }
)

watch(
  isEditMainScheduleBoxOpen,
  (newVal) => {
    travelStore.setEditMainScheduleParams()
  }
)

const { errors } = useInputValidator()
const { isSignInBtnDisabled } = useSubmitBtnState(travelStore.editMainScheduleParams, errors)

function hideBox() {

}

function updateDate({ startDate, endDate }) {
  // console.log("updateDate", { startDate, endDate });
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
    <template v-slot:header>編輯行程</template>
    <!-- <template v-slot:close-btn>
      <button @click="hideBox" type="button" class="block mt-auto mr-4 px-4 py-2 shadow-lg">Cancel</button>
    </template> -->
    <template v-slot:submit-btn>
      <button @click="updateMainSchedule" type="button" class="lightbox-submit-btn bg-travel-textgreen">儲存</button>
    </template>
    <template v-slot:banner>
      <!-- 圖片 -->
      <div>
        <!-- <DefaultImage></DefaultImage> -->
        <InputScheduleBanner v-model:picture="travelStore.editMainSchedulePicture"
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
    <template v-slot:footer>
      <!-- <div class="flex w-full">
        <button @click="hideBox" type="button" class="block mt-auto mr-4 px-4 py-2 shadow-lg">Cancel</button>
        <button @click="updateMainSchedule" type="button" class="mt-auto block px-4 py-2 shadow-lg">Submit</button>
      </div> -->
    </template>
  </LightBox>
</template>