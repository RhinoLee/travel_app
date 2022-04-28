<script setup>
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import { onMounted } from '@vue/runtime-core'
const travelStore = useTravelStore()
const { mainScheduleList } = storeToRefs(travelStore)

onMounted(() => {
  travelStore.getMainScheduleList()
})

</script>

<template>
  <div class="pt-[70px]">
    <div class="container">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="mainSchedule in mainScheduleList" :key="mainSchedule.id">
          <router-link 
          :to="{ name: 'MainSchedule', params: { mainScheduleId: mainSchedule.id }}"
          class="block"
          >
            <!-- <div><img :src="schedule.pic" alt=""></div> -->
            <div>
              <div>
                <p>{{ mainSchedule.title }}</p>
              </div>
              <div>
                <p>{{ mainSchedule.start_date }} ~ {{ mainSchedule.end_date }}</p>
              </div>
              <div>
                <p>{{ mainSchedule.intro }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>