<script setup>
import { onMounted, reactive, watch } from "vue";
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import InputScheduleBanner from "@/components/form/input/InputScheduleBanner.vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import LightBox from "@/components/common/LightBox.vue"
import InputTitle from "@/components/form/input/InputTitle.vue";
import DatePickerWrap from "@/components/common/DatePickerWrap.vue"
import { dateHandler } from "@/utils/dateTransform"
import DefaultImage from "@/components/common/DefaultImage.vue"


const travelStore = useTravelStore()
const { isAddMainScheduleBoxOpen } = storeToRefs(travelStore)

watch(
  isAddMainScheduleBoxOpen,
  (newVal) => {
    travelStore.clearAddMainScheduleParams()
  }
)

const { errors } = useInputValidator()
const canBeEmptyKeys = ["picture"]
const { isSubmitBtnDisabled } = useSubmitBtnState(travelStore.addMainScheduleParams, errors, canBeEmptyKeys)

function hideBox() {

}

function updateDate({ startDate, endDate }) {
  // travelStore.addMainScheduleParams.startDateObj = dateHandler.dateFormatDate(startDate)
  // travelStore.addMainScheduleParams.endDateObj = dateHandler.dateFormatDate(endDate)
  travelStore.addMainScheduleParams.startDate = startDate
  travelStore.addMainScheduleParams.endDate = endDate
}

async function addMainSchedule() {
  const result = await travelStore.addMainSchedule()
  travelStore.isAddMainScheduleBoxOpen = false
}

</script>

<template>
  <LightBox v-model:isBoxOpen="travelStore.isAddMainScheduleBoxOpen">
    <template v-slot:title>新增行程</template>
    <template v-slot:submit-btn>
      <button :disabled="isSubmitBtnDisabled" @click="addMainSchedule"
        :class="{ 'bg-disabled': isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled }"
        class="lightbox-submit-btn" type="button">儲存</button>
    </template>
    <template v-slot:banner>
      <!-- 圖片 -->
      <div>
        <!-- <DefaultImage></DefaultImage> -->
        <InputScheduleBanner v-model:picture="travelStore.addMainScheduleParams.picture"
          pictureUrl="" :isBoxOpen="travelStore.isAddMainScheduleBoxOpen">
        </InputScheduleBanner>
      </div>
    </template>
    <template v-slot:main>
      <form @submit.prevent class="w-full h-full flex flex-col items-start" novalidate>
        <InputTitle v-model:title="travelStore.addMainScheduleParams.title"></InputTitle>
        <div class="w-full">
          <label class="label">日期區間</label>
          <DatePickerWrap @updateDate="updateDate" :nowRange="[]"></DatePickerWrap>
        </div>
      </form>
    </template>
  </LightBox>
</template>