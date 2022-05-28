<script setup>
import { dateHandler } from "@/utils/dateTransform"
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, onMounted, watch, computed } from "vue"
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
  startTime: {
    type: Array,
    default: () => ([
      {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
      },
      {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
      }
    ])
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
const time = ref(props.startTime);
// disabledDates 版本
const selectDate = ref([])

// 欄位驗證 
const { errors, validateInit, validateTitleInput } = useInputValidator()
const inputParams = {
  inputName: "時間",
  inputKey: "date",
  value: ""
}

function validateInput() {
  validateTitleInput(inputParams);
}

watch(time, val => {
  if (!val) return
  const timeRange = {
    startTime: dateHandler.timeFormat(val[0].hours, val[0].minutes),
    endTime: dateHandler.timeFormat(val[1].hours, val[1].minutes),
  }
  emit("updateTime", timeRange)
},
  { immediate: true }
)

watch(
  () => props.startTime,
  newVal => {
    if (!newVal) return
    time.value = props.startTime
  },
  { immediate: true }
)

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

function handleDate(modelData) {
  // console.log("handleDate", modelData);
  if (!modelData) {
    inputParams.value = ""
    validateInput()
    return
  }

  date.value = modelData
  const dateRange = {
    startDate: modelData[0],
    endDate: modelData[1]
  }

  inputParams.value = dateRange
  validateInput()

  emit("updateDate", dateRange)
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

  for (let day = 1; day < props.durationDays - 1; day++) {
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

  <!-- disabledDates 版本 -->
  <!-- :utc="utc" -->
  <Datepicker v-if="!timePicker" v-model="date" @update:modelValue="handleDate" :utc="utc" :range="range"
    :enableTimePicker="enableTimePicker" :startTime="startTimeDefault" :disabledDates="disabledDates"
    @internalModelChange="handleInternal" :transitions="false" :minDate="minDate">
  </Datepicker>

  <Datepicker v-if="timePicker" v-model="time" :range="range" :utc="utc" :timePicker="timePicker" :readonly="readonly"
    format="HH:mm" :transitions="false">
  </Datepicker>

  <div v-if="errors[inputParams.inputKey]" class="text-red-500">{{ errors[inputParams.inputKey] }}</div>
</template>