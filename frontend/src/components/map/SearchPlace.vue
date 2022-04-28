<script setup>
import { ref } from "vue"
import { useTravelStore } from "@/stores/travel/travel"
import { storeToRefs } from 'pinia'

const emit = defineEmits(['searchTextHandler'])

const serchText = ref("")
const travelStore = useTravelStore()
const { locationSearchList } = storeToRefs(travelStore)

function searchTextHandler() {
  emit("searchTextHandler", serchText.value)
}

function getLocationInfo(place_id) {
  travelStore.getLocationInfo(place_id)
}

</script>
<template>
  <div class="w-full">
    <div class="w-full">
      <input v-model="serchText" @keyup.enter="searchTextHandler" type="text" class="w-full px-2 py-2 outline-none" placeholder="輸入目的地名稱">
      <!-- <ul v-if="locationSearchList.length > 0" class="bg-gray-100">
        <li class="border-b border-gray-400">
          <div @click="getLocationInfo(location.place_id)" v-for="location in locationSearchList" :key="location.place_id" class="px-2 py-1 cursor-pointer overflow-x-scroll no-scrollbar">
            <p class="text-md">{{ location.name }}</p>
            <p class="text-sm">評價：{{ location.rating }} / 5</p>
            <p class="text-sm">{{ location.formatted_address }}</p>
          </div>
        </li>
      </ul> -->
    </div>
  </div>
</template>