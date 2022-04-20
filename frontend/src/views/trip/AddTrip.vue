<script setup>
import { useRouter } from "vue-router"
import { storeToRefs } from 'pinia'
import DatePickerWrap from "@/components/common/DatePickerWrap.vue"
import { useTravelStore } from "@/stores/travel/travel"
import AddTrip from "@/components/travel/AddTrip.vue"


const router = useRouter()
const travelStore = useTravelStore()
const { dutationDays } = storeToRefs(travelStore)
async function updateDate({ startDate, endDate }) {
  travelStore.addTravle.startDate = startDate
  travelStore.addTravle.endDate = endDate
}
</script>
<template>
  <div class="outer-container middle">
    <div class="container middle">
      <h2>1. 選擇旅程時間</h2>
      
      <form>
        <div class="form-group">
          <label for="dateRange">開始日期 - 結束日期</label>
          <div class="date-selector">
            <DatePickerWrap @updateDate="updateDate"></DatePickerWrap>
          </div>
        </div>
      </form>
      <div v-if="dutationDays" class="total">總天數：{{ dutationDays + 1 }}天{{ dutationDays }}夜</div>
    </div>

    <AddTrip v-if="dutationDays"></AddTrip>
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