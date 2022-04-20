<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, onMounted, watch, defineProps } from "vue"
import { storeToRefs } from 'pinia'

const date = ref()
const props = defineProps({
  pickerParams: {
    type: Object,
    default: () => ({
      utc: true,
      enableTimePicker: false
    })
  }
})
const defaultRange = 7
const emit = defineEmits(["updateDate"])

watch(date, val => {
  if (!val) return
  const dateRange = {
    startDate: val[0],
    endDate: val[1]
  }
  emit("updateDate", dateRange)
}, { immediate: true })

onMounted(async () => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + defaultRange));
  date.value = [startDate, endDate];
})

</script>

<template>
  <Datepicker v-model="date" range :utc="pickerParams.utc" :enableTimePicker="pickerParams.enableTimePicker"></Datepicker>
</template>