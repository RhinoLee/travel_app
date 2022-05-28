<script setup>
import { ref, reactive } from "vue"
import loadingGIF from "@/assets/images/svg/loading.svg"
import { useCommonStore } from "@/stores/common"
import { storeToRefs } from "pinia";

const commonStore = useCommonStore()
const { isLoading } = storeToRefs(commonStore)

</script>
<template>
  <div :class="{ 'hidden': !isLoading }" class="fixed top-0 left-0 w-full h-full bg-black/50 z-50">
    <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div><img :src="loadingGIF" alt=""></div>
    </div>
  </div>
</template>