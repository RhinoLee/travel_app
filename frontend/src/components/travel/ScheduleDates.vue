<script setup>
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
const travelStore = useTravelStore()
const { nowSelectDate, singleScheduleSelectList } = storeToRefs(travelStore)

</script>
<template>
  <!-- 天數列表 -->
  <div class="relative w-full mb-[10px]">
    <div class="select-arrow"></div>
    <select v-model="nowSelectDate" class="w-full py-[8px] px-[12px] border border-travel-darkgreen rounded-[5px] overflow-hidden tracking-wider outline-none appearance-none">
      <option value="" disabled>旅程列表</option>
      <option v-for="(schedule, idx) in singleScheduleSelectList" :key="idx" :value="schedule.date">
        {{ schedule.date }} ({{ schedule.day }})
      </option>
    </select>
  </div>
</template>