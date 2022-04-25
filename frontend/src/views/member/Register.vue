<script setup>
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import { useRouter } from "vue-router"

const router = useRouter()
const memberStore = useMemberStore()
const { registerParams } = storeToRefs(memberStore)

async function registerHandler() {
  const result = await memberStore.registerHandler()
  if (result) return router.push({ name: "Login" })
}

</script>
<template>
  <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[450px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">註冊帳號</h1>
        </header>
        <main class="h-full">
          <form class="h-full flex flex-col items-start">
            <div class="mt-[10px] w-full">
              <label for="account" class="block py-1">帳號（請填寫信箱）</label>
              <input v-model.trim="registerParams.email" type="text" id="account" class="w-full px-2 py-2 border outline-none">
            </div>
            <div class="mt-[10px] w-full">
              <label for="password" class="block py-1">密碼</label>
              <input v-model.trim="registerParams.password" type="pasword" id="password" class="w-full px-2 py-2 border outline-none">
            </div>
            <div class="mt-[10px] w-full">
              <label for="repassword" class="block py-1">確認密碼</label>
              <input v-model.trim="registerParams.repassword" type="pasword" id="repassword" class="w-full px-2 py-2 border outline-none">
            </div>
            <button @click.prevent="registerHandler" class="mt-auto block px-4 py-2 shadow-lg">註冊帳號</button>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>