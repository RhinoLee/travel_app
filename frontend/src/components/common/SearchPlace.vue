<script setup>
import { ref } from "vue"
const emit = defineEmits(['searchTextHandler'])

const serchText = ref("")

function searchTextHandler() {
  console.log("searchTextHandler", serchText.value);
  emit("searchTextHandler", serchText.value)
}

</script>
<template>
  <div class="w-full">
    <div class="w-full">
      <input v-model="serchText" @keyup.enter="searchTextHandler" type="text" class="w-full px-2 py-2 outline-none">
      <ul class="bg-gray-100">
        <li class="border-b border-gray-400"><div class="px-2 py-1 cursor-pointer">ccc</div></li>
      </ul>
    </div>
  </div>
</template>