<script setup>
const props = defineProps({
  nowDayPlanList: {
    type: Array
  }
})

</script>

<template>
  <div>
    <div v-for="plan in props.nowDayPlanList" :key="plan.id" class="py-[20px] text-white border-t">
      <div class="font-bold text-lg">
        <span>日期：</span>
        <span>{{ plan.date }}</span>
      </div>
      <div v-for="(dayPlan, idx) in plan.plans" :key="idx" class="py-[10px]">
        <div>
          <span>時間區間：</span>
          <span>{{ dayPlan.startTime }} - {{ dayPlan.endTime }}</span>
        </div>
        <div>
          <span>行程：</span>
          <span>{{ dayPlan.title }}</span>
        </div>
        <div>
          <span>地點：</span>
          <span>{{ dayPlan.placeName }}</span>
        </div>
        <div>
          <span>筆記：</span>
          <span>{{ dayPlan.note }}</span>
        </div>
        <div>

        </div>

      </div>
    </div>
  </div>
</template>