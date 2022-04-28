<script setup>
const props = defineProps({
  placeDetail: {
    type: Object
  }
})

const emit = defineEmits(["addLocateToSchedule"])

async function addLocateToSchedule() {
  emit("addLocateToSchedule")
}

</script>

<template>
  <div v-if="placeDetail" class="absolute w-[30%] h-[90vh] left-[31%] top-[50%] -translate-y-[50%] bg-white z-10 shadow-lg p-[30px]">
    <div>
      <div class="py-2">評價：{{ placeDetail.rating }} / 5</div>
      <div class="py-2">評價數：{{ placeDetail.user_ratings_total }}</div>
      <div class="py-2"><p>名稱：{{ placeDetail.name }}</p></div>
      <div class="py-2"><p>地址：{{ placeDetail.address }}</p></div>
      <div class="py-2"><p>聯絡電話：{{ placeDetail.phone_number }}</p></div>
      <div class="py-2">
        <p class="pb-1">營業時間：</p>
        <div v-if="placeDetail.opening_hours">
          <p v-for="(text, idx) in placeDetail.opening_hours.weekday_text" :key="idx">{{ text }}</p>
        </div>
      </div>

      <div>
        <button @click="addLocateToSchedule" class="border px-4 py-2">加入行程</button>
      </div>
    </div>

  </div>  
</template>