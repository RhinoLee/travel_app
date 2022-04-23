<script setup>
const props = defineProps({
  nowDailyPlanList: {
    type: Array
  }
})

</script>

<template>
  <div>
    <pre>{{ nowDailyPlanList }}</pre>
    <div v-for="plan in props.nowDailyPlanList" :key="plan.id" class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ plan.date }}</span>
      </div>
      <div v-for="(dailyPlan, idx) in plan.plans" :key="idx" class="py-[10px] mt-[10px] cursor-pointer">
        <div>
          <span>時間區間：</span>
          <span>{{ dailyPlan.startTime }} - {{ dailyPlan.endTime }}</span>
        </div>
        <div>
          <span>行程：</span>
          <span>{{ dailyPlan.title }}</span>
        </div>
        <div>
          <span>地點：</span>
          <span>{{ dailyPlan.placeName }}</span>
        </div>
        <div>
          <span>筆記：</span>
          <span>{{ dailyPlan.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>