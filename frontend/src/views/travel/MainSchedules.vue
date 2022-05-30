<script setup>
import { storeToRefs } from 'pinia'
import { useTravelStore } from "@/stores/travel/travel"
import { onMounted, onBeforeUnmount } from '@vue/runtime-core'
import ScheduleItem from "@/components/travel/ScheduleItem.vue"
import AddMainScheduleForm from "@/components/form/AddMainScheduleForm.vue"
import EditMainScheduleForm from "@/components/form/EditMainScheduleForm.vue"
import LightBox from "@/components/common/LightBox.vue"

const travelStore = useTravelStore()
const { mainScheduleList } = storeToRefs(travelStore)

function addMainSchedule() {
  travelStore.isAddMainScheduleBoxOpen = true
}

async function deleteMainSchedule() {
  const result = await travelStore.deleteMainSchedule()
  travelStore.nowMainScheduleId = null
  travelStore.isDeleteMainScheduleBoxOpen = false
}

function closeActions() {
  travelStore.closeAction()
}

onMounted(() => {
  window.addEventListener("click", () => closeActions())
  travelStore.getMainScheduleList()
})

onBeforeUnmount(() => {
  closeActions()
  window.removeEventListener("click", closeActions)
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
            <!-- <button class="block mr-[16px] text-[16px] text-travel-darkgreen">選取</button> -->
            <button @click="addMainSchedule" class="block py-[4px] px-[12px] text-[16px] text-white bg-travel-textgreen rounded-[5px]" type="button">+New</button>
          </div>
        </div>
      </div>
      <!-- ScheduleList -->
      <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="mainSchedule in mainScheduleList" :key="mainSchedule.id">
          <ScheduleItem :mainSchedule="mainSchedule"></ScheduleItem>
        </div>
      </div>
    </div>
  </div>

  <AddMainScheduleForm></AddMainScheduleForm>
  <EditMainScheduleForm></EditMainScheduleForm>
  <LightBox v-model:isBoxOpen="travelStore.isDeleteMainScheduleBoxOpen">
    <template v-slot:title>刪除行程</template>
    <template v-slot:submit-btn>
      <button @click="deleteMainSchedule"
        class="lightbox-submit-btn bg-travel-textgreen" type="button">刪除</button>
    </template>
    <template v-slot:main>
      <div>確定要刪除行程？</div>
    </template>
  </LightBox>

</template>