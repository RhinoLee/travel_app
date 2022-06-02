<script setup>
import { onBeforeMount, onUpdated, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from "@/components/common/Header.vue"
import Sidebar from "@/components/common/Sidebar.vue"
import Loading from "@/components/common/Loading.vue"
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'

const memberStore = useMemberStore()
const { isLogin } = storeToRefs(memberStore)

</script>

<template>
  <div>
    <Header v-if="isLogin"></Header>
    <RouterView />
    <Sidebar v-if="isLogin"></Sidebar>
  </div>
  <!-- <Loading></Loading> -->
</template>