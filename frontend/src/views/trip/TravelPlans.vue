<script setup>
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
const travelStore = useTravelStore()
const { plansList } = storeToRefs(travelStore)
</script>

<template>
  <div class="pt-[70px]">
    <div class="container">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="plan in plansList" :key="plan.id">
          <router-link 
          :to="{ name: 'TravelPlan', params: { planId: plan.id }}"
          class="block"
          >
            <div><img :src="plan.pic" alt=""></div>
            <div>
              <div>
                <p>{{ plan.title }}</p>
              </div>
              <div>
                <p>{{ plan.startDate }} ~ {{ plan.endDate }}</p>
              </div>
              <div>
                <p>{{ plan.intro }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>