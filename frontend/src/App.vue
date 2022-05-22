<script setup>
// import { computed, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import Header from "@/components/common/Header.vue"
import Loading from "@/components/common/Loading.vue"

</script>

<template>
  <div>
    <Header></Header>
    <RouterView />
  </div>
  <Loading></Loading>
</template>