<script setup>
import { onMounted } from "vue"
import { useRoute, useRouter } from 'vue-router';
import { useMemberStore } from "@/stores/member"

const memberStore = useMemberStore()

onMounted(async () => {
  const routes = useRoute()
  const router = useRouter()
  // if (!routes.query.token) return router.push({ name: "Login" })
  if (!routes.query.token) return
  const token = routes.query.token
  const result = await memberStore.verifyMember(token)
  // router.push({ name: "Login" })
})

</script>

<template>
  <h1>Verify Email</h1>
</template>