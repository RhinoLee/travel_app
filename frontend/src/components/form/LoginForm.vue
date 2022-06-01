<script setup>
import { unref } from "vue"
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAccount from "@/components/form/input/InputAccount.vue";
import InputPassword from "@/components/form/input/InputPassword.vue";

const memberStore = useMemberStore()
const { loginParams } = storeToRefs(memberStore)

const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(unref(loginParams), errors)

function submitHandler() {
  emit("submitHandler", loginParams)
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="h-full flex flex-col items-start" novalidate>
    <InputAccount v-model:email="memberStore.loginParams.email"></InputAccount>
    <InputPassword v-model:password="memberStore.loginParams.password"></InputPassword>

    <div class="flex items-center mt-auto">
      <button :disabled="isSubmitBtnDisabled" type="submit" class="block px-4 py-2 shadow-lg">Submit</button>
      <router-link class="pl-4 py-2" :to="{ name: 'ForgotPassword' }">忘記密碼？</router-link>
    </div>
  </form>
</template>