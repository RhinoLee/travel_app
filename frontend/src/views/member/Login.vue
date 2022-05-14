<script setup>
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import { useRouter } from "vue-router"
import Form from "@/components/form/Form.vue";


const router = useRouter()
const memberStore = useMemberStore()
const { loginParams } = storeToRefs(memberStore)

async function submitHandler(loginParams) {
  memberStore.loginParams = loginParams
  const result = await memberStore.loginHandler()
  if (result) return router.push({ name: "MainSchedules" })
}

</script>
<template>
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[400px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">登入</h1>
        </header>
        <main class="h-full">
          <Form @submitHandler="submitHandler"></Form>
        </main>
      </div>
    </div>
  </div>
</template>