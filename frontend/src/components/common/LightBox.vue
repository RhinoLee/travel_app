<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  isBoxOpen: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(["hideBox"])

const isOpen = ref(false)

watch(
  () => props.isBoxOpen,
  (newVal) => {
    isOpen.value = newVal
  }
)

function hideBox(e) {
  if (e.target.id !== "lightboxMask") return
  emit("hideBox")
  isOpen.value = false
}
</script>
<template>
  <teleport to="body">
    <div @click="hideBox" id="lightboxMask" :class="{ 'hidden': !isOpen }" class="fixed inset-0 w-[100vw] h-[100vh] z-10 bg-black/50">
      <div class="fixed flex flex-col w-[60%] h-[470px] left-1/2 top-1/4 -translate-x-1/2 bg-white">
        <header class="border-b px-6 py-4">
          <slot name="header"></slot>
        </header>
        <main class="px-6 py-4">
          <slot name="main"></slot>
        </main>
        <footer class="mt-auto ml-auto mb-[30px] mr-[40px]">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>
