<script setup>
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import { onMounted } from '@vue/runtime-core'
import ScheduleItem from "@/components/travel/ScheduleItem.vue"
import MainScheduleForm from "@/components/form/MainScheduleForm.vue"

const travelStore = useTravelStore()
const { mainScheduleList } = storeToRefs(travelStore)

onMounted(() => {
  travelStore.getMainScheduleList()
})

</script>

<template>
  <div class="pt-[50px] pb-[40px]">
    <div class="container">
      <!-- title -->
      <div class="mb-[40px]">
        <h2>規劃行程</h2>
      </div>
      <!-- select -->
      <div class="mb-[16px]">
        <div class="flex justify-between border-b border-travel-green pb-[10px]">
          <div></div>
          <div class="flex items-center">
            <button class="block mr-[16px] text-[16px] text-travel-darkgreen">選取</button>
            <router-link class="block py-[4px] px-[12px] text-[16px] text-white bg-travel-textgreen rounded-[5px]"
              :to="{ name: 'AddMainSchedule' }">+New</router-link>
          </div>
        </div>
      </div>
      <!-- ScheduleList -->
      <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="mainSchedule in mainScheduleList" :key="mainSchedule.id">
          <ScheduleItem :mainSchedule="mainSchedule"></ScheduleItem>
        </div>
        <router-link :to="{ name: 'AddMainSchedule' }"
          class="relative block w-full rounded-[10px] bg-white shadow overflow-hidden cursor-pointer">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">+New</div>
        </router-link>
      </div>
    </div>
  </div>

  <MainScheduleForm></MainScheduleForm>
</template>