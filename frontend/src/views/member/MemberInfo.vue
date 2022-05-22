<script setup>
import { reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import robot from "@/assets/images/png/robot.png"
import LightBox from "@/components/common/LightBox.vue"
import AvatarForm from "@/components/form/AvatarForm.vue"

const memberStore = useMemberStore()
const { memberInfo, avatarSrc } = storeToRefs(memberStore)
const lightbox = reactive({ editBox: false })

function openBox(boxname) {
  // lightbox[boxname] = true
  memberStore.isEditBoxOpen = true
}

</script>
<template>
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[400px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">用戶資訊</h1>
        </header>
        <main class="h-full">
          <div class="flex justify-center mb-[40px] mt-[10px]">
            <div class="relative w-[120px] h-[120px] border rounded-full overflow-hidden">
              <img :src="avatarSrc" class=" w-full h-full object-cover object-center">
              <div @click="openBox('editBox')"
                class="absolute bottom-0 w-full h-[30%] flex justify-center pt-1 bg-black/50 text-white text-sm cursor-pointer">
                編輯頭像
              </div>
            </div>
          </div>
          <ul>
            <li><span>帳號：</span><span>{{ memberInfo.email }}</span></li>
          </ul>
        </main>
      </div>
    </div>
  </div>

  <!-- 開光箱，設定頭像 -->
  <AvatarForm></AvatarForm>
</template>