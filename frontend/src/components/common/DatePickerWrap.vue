<script setup>
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
  // pickerParams: {
  //   type: Object,
  //   default: () => ({
  //     utc: true,
  //     enableTimePicker: false,
  //     timePicker: false
  //   })
  // }
})

const emit = defineEmits(["updateDate", "updateTime"])

const date = ref(new Date())
const startTime = ref([{ hours: 0, minutes: 0 }, { hours: 0, minutes: 0 }]);
const time = ref([
  {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
  },
  {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
  }
]);

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
    startTime: val[0].hours.toString() + ":" + val[0].minutes.toString(),
    endTime: val[1].hours.toString() + ":" + val[1].minutes.toString(),
  }
  emit("updateTime", timeRange)
},
  { immediate: true }
)

// onMounted(async () => {
//   const startDate = new Date();
//   const endDate = new Date(new Date().setDate(startDate.getDate() + defaultRange));
//   date.value = [startDate, endDate];
// })

</script>

<template>
  <Datepicker v-if="!timePicker" v-model="date" :range="range" :utc="utc" :enableTimePicker="enableTimePicker"
    :startTime="startTime">
  </Datepicker>

  <Datepicker v-if="timePicker" v-model="time" :range="range" :utc="utc" :timePicker="timePicker">
  </Datepicker>
</template>