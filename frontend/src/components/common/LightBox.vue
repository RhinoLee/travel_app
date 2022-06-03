<script setup>
import { ref, watch } from "vue"
import CloseBtn from "@/components/common/CloseBtn.vue"

const props = defineProps({
  isBoxOpen: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(["update:isBoxOpen"])

function hideBox(e) {
  if (e.target.id === "lightboxMask" || e.target.id === "closeBtn") {
    emit("update:isBoxOpen", false)
  }
}
</script>
<template>
  <teleport to="body">
    <div v-if="isBoxOpen" @click="hideBox" id="lightboxMask" :class="{ 'hidden': !isBoxOpen }"
      class="fixed inset-0 w-[100vw] h-[100vh] z-50 bg-black/50">
      <div
        class="fixed flex flex-col w-[300px] xs:w-[472px] lg:w-[572px] max-h-[620px] min-h-[220px] left-1/2 top-1/4 -translate-x-1/2 bg-white overflow-y-scroll no-scrollbar">
        <header class="border-b px-[22px] py-[10px]">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="mr-[14px] w-[20px] h-[20px] overflow-hidden ">
                <CloseBtn @click.stop="hideBox"></CloseBtn>
              </div>
              <div class="text-[20px] text-travel-textgreen">
                <slot name="title"></slot>
              </div>
            </div>
            <div>
              <slot name="submit-btn"></slot>
            </div>
          </div>
        </header>

        <slot name="banner"></slot>

        <main class="px-10 py-4">
          <slot name="main"></slot>
        </main>
        <footer class="mt-auto ml-auto mb-[30px] mr-[40px]">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>
