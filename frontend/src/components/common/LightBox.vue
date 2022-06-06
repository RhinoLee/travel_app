<script setup>
const props = defineProps({
  isBoxOpen: {
    type: Boolean,
    default: false
  },
  // 預設點擊 mask or closebtn 會關閉光箱
  maskDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:isBoxOpen"])

function hideBox(e) {
  if (e.target.id === "lightboxMask" || e.target.id === "closeBtn") {
    if (!props.maskDisabled) emit("update:isBoxOpen", false)
  }
}
</script>
<template>
  <teleport to="body">
    <div v-if="isBoxOpen" @click="hideBox" id="lightboxMask" :class="{ 'hidden': !isBoxOpen }"
      class="fixed inset-0 w-[100vw] h-full z-40 bg-black/50">
      <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xs:w-[472px] lg:w-[572px] max-h-[620px] min-h-[220px] bg-white rounded-[5px] overflow-hidden">
        <div
          class="flex flex-col w-full h-full overflow-y-scroll no-scrollbar">
          <header class="border-b px-[22px] py-[10px]">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="mr-[14px] w-[20px] h-[20px] overflow-hidden ">
                  <CloseBtn @click.stop="hideBox"></CloseBtn>
                </div>
                <div class="text-[18px] md:text-[20px] text-travel-textgreen">
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

    </div>
  </teleport>
</template>
