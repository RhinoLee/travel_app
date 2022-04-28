<script setup>
import { useRouter } from "vue-router"
import { storeToRefs } from 'pinia'
import DatePickerWrap from "@/components/common/DatePickerWrap.vue"
import { useTravelStore } from "@/stores/travel/travel"

const router = useRouter()
const travelStore = useTravelStore()
const { dutationDays, addMainScheduleParams } = storeToRefs(travelStore)

async function updateDate({ startDate, endDate }) {
  travelStore.addMainScheduleParams.startDate = startDate
  travelStore.addMainScheduleParams.endDate = endDate
}

async function addMainSchedule() {
  const result = await travelStore.addMainSchedule()
}

</script>
<template>
  <div class="outer-container middle">
    <div class="container middle pt-[30px]">

      <h2 class="font-bold">新增旅程</h2>
      <form>
        <div class="form-group mb-2">
          <label for="title" class="py-1">旅程名稱</label>
          <input v-model.trim="addMainScheduleParams.title" type="text" id="title" class="block border px-2 py-1">
        </div>
        <div class="form-group mb-2">
          <label for="dateRange">開始日期 - 結束日期</label>
          <div class="date-selector">
            <DatePickerWrap @updateDate="updateDate"></DatePickerWrap>
          </div>
        </div>
      </form>
      <div v-if="dutationDays" class="total">總天數：{{ dutationDays + 1 }}天{{ dutationDays }}夜</div>
      <div class="mt-4">
        <button @click="addMainSchedule" class="px-3 py-1 border">新增旅程</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 25px;
}

.total {
  padding: 10px 0;
}
</style>