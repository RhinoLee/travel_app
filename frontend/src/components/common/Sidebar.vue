<script setup>
import { storeToRefs } from 'pinia'
import { useCommonStore } from "@/stores/common"

const commonStore = useCommonStore()
const { isMenuOpen } = storeToRefs(commonStore)

</script>
<template>
  <nav
    @mouseenter="commonStore.isMenuOpen = true"
    @mouseleave="commonStore.isMenuOpen = false"
    :class="{ 'left-0': isMenuOpen, 'md:-left-[168px]': !isMenuOpen, '-left-[180px]': !isMenuOpen }"
    class="fixed top-[54px] px-[10px] w-[180px] h-full border-r-[2px] border-travel-green bg-white tracking-[1px] transition-all duration-700 z-20">
    <div class="relative w-full h-full">
      <div class="pt-[53px]">
        <h3 class="mb-[10px] px-[15px] text-travel-textgreen text-xs">主功能</h3>
        <ul class="child:mt-[8px]">
          <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'MainSchedules' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <i class="block mr-[8px]">i</i>
              <div>行程列表</div>
            </router-link>
          </li>
          <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'AddMainSchedule' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <i class="block mr-[8px]">i</i>
              <div>新增行程</div>
            </router-link>
          </li>
          <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'AddMainSchedule' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <i class="block mr-[8px]">i</i>
              <div>收藏地點</div>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="pt-[53px]">
        <h3 class="mb-[10px] px-[15px] text-travel-textgreen text-xs">捷徑</h3>
        <ul class="child:mt-[8px]">
          <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'AddMainSchedule' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <i class="block mr-[8px]">i</i>
              <div>中秋台東遊</div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- sidebar-trigger -->
      <button @click="commonStore.toggleMenu" class="hidden md:block absolute top-[140px] left-[calc(100%+12px)] w-[20px] h-[88px] text-[12px] text-travel-darkgreen bg-travel-green tracking-normal rounded-tr-[10px] rounded-br-[10px]">
        展開選單
      </button>
    </div>
  </nav>
</template>