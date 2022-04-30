<script setup>
import { dateHandler } from "@/utils/dateTransform"
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, onMounted, watch, defineProps } from "vue"
import { storeToRefs } from 'pinia'

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
})

const emit = defineEmits(["updateDate", "updateTime"])

const date = ref(new Date())
const startTime = ref([{ hours: 0, minutes: 0 }, { hours: 0, minutes: 0 }]);
const time = ref(props.startTime);


const defaultRange = 7


watch(date, val => {
  if (!val) return
  const dateRange = {
    startDate: val[0],
    endDate: val[1]
  }
  emit("updateDate", dateRange)
}, { immediate: true })

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
</script>

<template>
  <Datepicker v-if="!timePicker" v-model="date" :range="range" :utc="utc" :enableTimePicker="enableTimePicker"
    :startTime="startTime">
  </Datepicker>

  <Datepicker v-if="timePicker" v-model="time" :range="range" :utc="utc" :timePicker="timePicker" :readonly="readonly" format="HH:mm">
  </Datepicker>
</template>