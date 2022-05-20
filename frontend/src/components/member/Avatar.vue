<!-- <script setup>
import robot from "@/assets/images/png/robot.png"
import { computed } from "@vue/runtime-core"

const props = defineProps({
  avatar: {
    type: String
  }
})

const emit = defineEmits("openBox")

const avatarSrc = computed(() => {
  return props.avatar ? props.avatar : robot
})

function openBoxHandler(val) {
  emit("openBox", val)
}

</script>

<template>
  <div class="flex justify-center mb-[40px] mt-[10px]">
    <div class="relative w-[120px] h-[120px] border rounded-full overflow-hidden">
      <img :src="avatarSrc" class=" w-full h-full object-cover object-center">
      <div
        @click="openBoxHandler('editBox')"
        class="absolute bottom-0 w-full h-[30%] flex justify-center pt-1 bg-black/50 text-white text-sm cursor-pointer">
        編輯頭像
      </div>
    </div>
  </div>
</template> -->