<script setup>
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Header from "@/components/common/Header.vue"
import { useMemberStore } from "@/stores/member"

// const router = useRouter()
// const memberStore = useMemberStore()

// onMounted(() => {
//   const token = localStorage.getItem("token")
//   if (token) return memberStore.getMemberInfo()

//   router.push({ name: "Login" })
  
// })
</script>

<template>
  <div>
    <Header></Header>
    <RouterView />
  </div>
</template>