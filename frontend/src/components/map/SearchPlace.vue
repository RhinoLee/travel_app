<script setup>
import litneraryIcon from "@/assets/images/svg/icon_litnerary.svg"
import cancelIcon from "@/assets/images/svg/icon_cancel_gray.svg"
// import { useTravelStore } from "@/stores/travel/travel"
// import { storeToRefs } from 'pinia'

const emit = defineEmits(["searchTextHandler"])

const serchText = ref("")
// const travelStore = useTravelStore()
// const { locationSearchList } = storeToRefs(travelStore)

function searchTextHandler() {
  emit("searchTextHandler", serchText.value)
}

function clearInput() {
  serchText.value = ""
}

</script>
<template>
  <div class="w-full">
    <div class="flex items-center justify-center w-full border border-travel-green rounded-[5px] overflow-hidden">
      <div class="box-content border-r border-travel-green w-[24px] h-[24px] px-[10px]">
        <img :src="litneraryIcon" class="w-full h-full object-cover object-center">
      </div>
      
      <input v-model="serchText" @keyup.enter="searchTextHandler" type="text"
        class="w-full px-[10px] py-[10px] outline-none placeholder:tracking-widest placeholder:text-[14px]"
        placeholder="搜尋地點並加入行程">

      <!-- clear btn -->
      <button @click="clearInput" class="w-[20px] h-[20px] mr-[10px]" type="button">
        <img class="w-full h-full object-cover object-center" :src="cancelIcon" alt="刪除">
      </button>
    </div>
  </div>
</template>