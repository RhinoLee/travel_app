<script setup>
import { storeToRefs } from 'pinia'
import { useCommonStore } from "@/stores/common"
import LitneraryIcon from "@/assets/images/svg/icon_litnerary.svg"
import CollectIcon from "@/assets/images/svg/icon_collect.svg"

const commonStore = useCommonStore()
const { isMenuOpen } = storeToRefs(commonStore)

</script>
<template>
  <nav
    @mouseenter="commonStore.isMenuOpen = true"
    @mouseleave="commonStore.isMenuOpen = false"
    :class="{ 'left-0': isMenuOpen, 'md:-left-[268px]': !isMenuOpen, '-left-[280px]': !isMenuOpen }"
    class="sidebar-menu border-travel-green w-[280px] bg-white z-20">
    <div class="relative w-full h-full px-[30px]">
      <div class="pt-[54px]">
        <h3 class="mb-[10px] px-[15px] text-travel-textgreen text-xs">主功能</h3>
        <ul class="child:mt-[8px]">
          <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'MainSchedules' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <div class="block mr-[8px] w-[24px]">
                <img class="w-full h-auto" :src="LitneraryIcon">
              </div>
              <div>規劃行程</div>
            </router-link>
          </li>
          <!-- <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'AddMainSchedule' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <div class="block mr-[8px] w-[24px]">
                <img class="w-full h-auto" :src="CollectIcon">
              </div>
              <div>收藏地點</div>
            </router-link>
          </li> -->
        </ul>
      </div>

      <!-- <div class="pt-[54px]">
        <h3 class="mb-[10px] px-[15px] text-travel-textgreen text-xs">捷徑</h3>
        <ul class="child:mt-[8px]">
          <li class="rounded-[10px] overflow-hidden hover:bg-travel-lightgreen">
            <router-link :to="{ name: 'AddMainSchedule' }" class="flex items-center py-[10px] px-[20px] text-sm">
              <i class="block mr-[8px]">i</i>
              <div>中秋台東遊</div>
            </router-link>
          </li>
        </ul>
      </div> -->

      <!-- sidebar-trigger -->
      <button @click="commonStore.toggleMenu" class="sidebar-trigger hidden md:block top-[140px] text-travel-darkgreen bg-travel-green">
        {{ isMenuOpen ? "收起選單" : "展開選單" }}
      </button>
    </div>
  </nav>
</template>