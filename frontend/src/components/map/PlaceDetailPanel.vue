<script setup>
import { ref, watch } from "vue"
const props = defineProps({
  placeDetail: {
    type: Object
  }
})

watch(
  () => props.placeDetail,
  newVal => {
    triggerPanel(true)
  }
)
const isPanelOpen = ref(false)
const emit = defineEmits(["addLocateToSchedule", "closePanel", "addPlaceCollection"])

function addLocateToSchedule() {
  emit("addLocateToSchedule")
}

function addPlaceCollection() {
  emit("addPlaceCollection")
}

function triggerPanel(isOpen) {
  isPanelOpen.value = isOpen
  if (!isOpen) emit("closePanel")
}

</script>

<template>
  <div v-if="placeDetail" :class="{ hidden: !isPanelOpen }" class="absolute w-[30%] h-[90vh] left-[31%] top-[50%] -translate-y-[50%] bg-white z-10 shadow-lg p-[30px]">
    <div class="flex justify-end mb-4">
      <button @click="triggerPanel(false)" class="border px-2 py-1 text-sm">X</button>
    </div>
    <div>
      <img v-if="placeDetail.photos && placeDetail.photos.length > 0" :src="placeDetail.photos[0]" alt="">
    </div>
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
        <button @click="addLocateToSchedule" class="border px-4 py-2 ml-2">加入行程</button>
        <button @click="addPlaceCollection" class="border px-4 py-2 ml-2">加入收藏</button>
      </div>
    </div>

  </div>  
</template>