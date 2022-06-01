<script setup>
import { useTravelStore } from "@/stores/travel/travel"
import { watch } from "@vue/runtime-core"
import { storeToRefs } from 'pinia'
const travelStore = useTravelStore()
const { nowSelectDate, durationDateList } = storeToRefs(travelStore)

const props = defineProps({
  selectDate: {
    type: String
  },
  dayOrder: {
    type: [Number, String],
    default: null
  },
})
const emit = defineEmits([ "update:selectDate", "update:dayOrder" ])

watch(
  () => props.selectDate,
  (newVal) => {
    changeHandler(null, newVal)
  },
  { immediate: true }
)

function changeHandler(e, date=null) {
  let dateValue = ""
  if (e) dateValue = e.target.value
  if (date) dateValue = date

  emit("update:selectDate", dateValue)
  const dayOrder = travelStore.durationDateList.findIndex(item => item.date === dateValue) + 1
  emit("update:dayOrder", dayOrder)
}

</script>
<template>
  <!-- 天數列表 -->
  <div class="relative w-full mb-[10px]">
    <div class="select-arrow"></div>
    <select :value="selectDate" @change="changeHandler" class="w-full py-[8px] px-[12px] border border-travel-green rounded-[5px] overflow-hidden tracking-wider outline-none appearance-none">
      <option value="" disabled>旅程列表</option>
      <option v-for="(schedule, idx) in durationDateList" :key="idx" :value="schedule.date">
        {{ schedule.date }} ({{ schedule.day }})
      </option>
    </select>
  </div>
</template>