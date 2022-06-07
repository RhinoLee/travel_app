<script setup>
import { dateHandler } from "@/utils/dateTransform"
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  range: {
    type: Boolean,
    default: true
  },
  utc: {
    type: Boolean,
    default: true
  },
  enableTimePicker: {
    type: Boolean,
    default: false
  },
  timePicker: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  timeRange: {
    type: Array,
    default: () => ([
      {
        hours: 0,
        minutes: 0
      },
      {
        hours: 0,
        minutes: 0
      }
      // {
      //   hours: new Date().getHours(),
      //   minutes: new Date().getMinutes()
      // },
      // {
      //   hours: new Date().getHours(),
      //   minutes: new Date().getMinutes()
      // }
    ])
  },
  startTime: {
    type: Object,
    default: () => ({ hours: 0, minutes: 0 })
  },
  nowRange: {
    type: Array,
    default: () => []
    // default: () => [new Date(), new Date(new Date().setDate(startDate.getDate() + 7))]
  },
  durationDays: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(["updateDate", "updateTime"])

const date = ref()
const startTimeDefault = ref([{ hours: 0, minutes: 0, seconds: 0 }, { hours: 0, minutes: 0, seconds: 0 }]);
const time = ref();
// disabledDates 版本
const selectDate = ref([])

// 欄位驗證 
const { errors, validateInit, validateRequiredInput } = useInputValidator()

const inputStartDate = {
  inputName: "起始日期",
  inputKey: "startDate",
  value: ""
}
const inputEndDate = {
  inputName: "結束日期",
  inputKey: "endDate",
  value: ""
}

const inputStartTime = {
  inputName: "開始時間",
  inputKey: "start_time",
  value: ""
}

// const inputEndTime = {
//   inputName: "結束時間",
//   inputKey: "end_time",
//   value: ""
// }

function validateDate() {
  validateRequiredInput(inputStartDate);
  validateRequiredInput(inputEndDate);
}

function validateTime() {
  validateRequiredInput(inputStartTime);
  // validateRequiredInput(inputEndTime);
}

watch(
  () => props.startTime,
  newVal => {
    if (!newVal) return
    time.value = props.startTime
  },
  { immediate: true }
)
// watch(
//   () => props.timeRange,
//   newVal => {
//     if (!newVal) return
//     time.value = props.timeRange
//   },
//   { immediate: true }
// )

watch(
  () => props.nowRange,
  newVal => {
    if (!newVal || newVal.length === 0) return
    if (!date.value) date.value = newVal
    // disabledDates 版本
    selectDate.value[0] = newVal[0]
  },
  { immediate: true }
)

// 更新日期
function handleDate(modelData) {
  if (!modelData) {
    inputStartDate.value = ""
    inputEndDate.value = ""
    date.value = []
    validateDate()
    return
  }

  date.value = modelData
  const dateRange = {
    startDate: modelData[0],
    endDate: modelData[1]
  }

  inputStartDate.value = dateRange.startDate
  inputEndDate.value = dateRange.endDate
  validateDate()

  emit("updateDate", dateRange)
}

// 更新時間
function handleTime(modelData) {
  if (!modelData) {
    inputStartTime.value = ""
    // inputEndTime.value = ""
    validateTime()
    return emit("updateTime", "")
  }

  const startTime = dateHandler.timeFormat(modelData.hours, modelData.minutes)

  inputStartTime.value = startTime
  // const timeRange = {
  //   startTime: dateHandler.timeFormat(modelData[0].hours, modelData[0].minutes),
  //   endTime: dateHandler.timeFormat(modelData[1].hours, modelData[1].minutes),
  // }

  // inputStartTime.value = timeRange.startTime
  // inputEndTime.value = timeRange.endTime
  validateTime()

  emit("updateTime", startTime)
  // emit("updateTime", timeRange)
}

// disabledDates 版本 => user 編輯 mainSchedule 時間區間規則：一定要 >= 原本的區間天數
function handleInternal(newdate) {
  if (!newdate) return
  selectDate.value[0] = newdate[0]
  if (newdate[1]) selectDate.value[1] = newdate[1]
  else selectDate.value.length = 1
}

const disabledDates = computed(() => {
  if (!props.durationDays) return []
  const startDate = selectDate.value[0]
  const dates = []

  for (let day = 1; day <= props.durationDays - 1; day++) {
    let date = new Date(startDate)
    date.setDate(startDate.getDate() + day)
    dates.push(date)
  }

  return dates
})

const minDate = computed(() => {
  if (selectDate.value.length === 1) return selectDate.value[0]
  return null
})

</script>

<template>
  <!-- <Datepicker v-if="!timePicker" v-model="date" :range="range" :utc="utc" :enableTimePicker="enableTimePicker"
    :startTime="startTime" :transitions="false"
    >
  </Datepicker> -->

  <!-- date picker disabledDates 版本 -->
  <Datepicker v-if="!timePicker" v-model="date" @update:modelValue="handleDate" :range="range" :utc="utc"
    :enableTimePicker="enableTimePicker" :startTime="startTimeDefault" :disabledDates="disabledDates"
    @internalModelChange="handleInternal" :transitions="false" :minDate="minDate">
  </Datepicker>

  <!-- time picker range 版本 -->
  <!-- <Datepicker v-if="timePicker" v-model="time" @update:modelValue="handleTime" :range="range" :utc="utc"
    :timePicker="timePicker" :readonly="readonly" format="HH:mm" :transitions="false">
  </Datepicker> -->

  <!-- time picker (just start time) 版本 -->
  <Datepicker v-if="timePicker" v-model="time" :startTime="startTime" @update:modelValue="handleTime"
    :utc="utc" :timePicker="timePicker" :readonly="readonly" format="HH:mm" :transitions="false" autoApply>
  </Datepicker>

  <div v-if="errors[inputStartDate.inputKey]" class="text-alert">{{ errors[inputStartDate.inputKey] }}</div>
  <div v-if="errors[inputEndDate.inputKey]" class="text-alert">{{ errors[inputEndDate.inputKey] }}</div>
  <div v-if="errors[inputStartTime.inputKey]" class="text-alert">{{ errors[inputStartTime.inputKey] }}</div>
  <!-- <div v-if="errors[inputEndTime.inputKey]" class="text-alert">{{ errors[inputEndTime.inputKey] }}</div> -->
</template>