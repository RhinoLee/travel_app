<script setup>
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'
const travelStore = useTravelStore()
const { nowSelectDate, singleScheduleSelectList } = storeToRefs(travelStore)

</script>
<template>
  <!-- 天數列表 -->
  <select v-model="nowSelectDate" class="w-full py-1 px-2 outline-none">
    <option value="" disabled>旅程列表</option>
    <!-- {{ schedule.day }} -->
    <option v-for="(schedule, idx) in singleScheduleSelectList" :key="idx" :value="schedule.date">{{
        schedule.date
    }} </option>
  </select>
</template>