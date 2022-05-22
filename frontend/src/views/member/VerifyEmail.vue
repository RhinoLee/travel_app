<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue"
import { useRoute, useRouter } from 'vue-router';
import { useMemberStore } from "@/stores/member"
import { set } from "date-fns";

const router = useRouter()
const memberStore = useMemberStore()
const verifyResult = ref("")
let redirectTimeout = null

onMounted(async () => {
  console.log("mounted");
  const routes = useRoute()
  if (!routes.query.token) return router.push({ name: "Login" })
  const token = routes.query.token
  const result = await memberStore.verifyMember(token)
  
  if (result.success) verifyResult.value = "驗證成功，即將幫您導向登入頁面"
  else verifyResult.value = "驗證失敗，請稍後再嘗試，即將幫您導向登入頁面"

  redirectTimeout = setTimeout(() => {
    router.push({ name: "Login" })
  }, 3000)
})

onBeforeUnmount(() => {
  clearTimeout(redirectTimeout)
})

</script>

<template>
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[400px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">驗證結果</h1>
        </header>
        <main class="h-full">
          {{ verifyResult }}
        </main>
      </div>
    </div>
  </div>
</template>