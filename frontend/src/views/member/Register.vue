<script setup>
import { onMounted } from "vue"
import { useMemberStore } from "@/stores/member"
import { useRouter } from "vue-router"
import RegisterForm from "@/components/form/RegisterForm.vue";

const router = useRouter()
const memberStore = useMemberStore()

async function submitHandler(formParams) {
  memberStore.registerParams = formParams
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
          <RegisterForm @submitHandler="submitHandler"></RegisterForm>
        </main>
      </div>
    </div>
  </div>
</template>