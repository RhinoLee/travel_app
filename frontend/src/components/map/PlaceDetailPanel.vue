<script setup>
const props = defineProps({
  placeDetail: {
    type: Object
  }
})
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
        <div>
          <p v-for="(text, idx) in placeDetail.opening_hours.weekday_text" :key="idx">{{ text }}</p>
        </div>
      </div>
    </div>
  </div>  
</template>