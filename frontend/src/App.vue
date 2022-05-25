<script setup>
// import { onBeforeMount, onUpdated } from 'vue'
import { RouterView } from 'vue-router'
import Header from "@/components/common/Header.vue"
import Sidebar from "@/components/common/Sidebar.vue"
import Loading from "@/components/common/Loading.vue"
</script>

<template>
  <div>
    <Header></Header>
    <RouterView />
    <Sidebar></Sidebar>
  </div>
  <Loading></Loading>
</template>