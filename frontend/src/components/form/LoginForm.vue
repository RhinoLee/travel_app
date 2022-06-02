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
  <form @submit.prevent="submitHandler" class="form" novalidate>
    <InputAccount v-model:email="memberStore.loginParams.email"></InputAccount>
    <InputPassword v-model:password="memberStore.loginParams.password"></InputPassword>

    <button :disabled="isSubmitBtnDisabled"
      :class="{ 'shadow-travel-textgreen': !isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled, 'shadow-disabled': isSubmitBtnDisabled, 'bg-disabled': isSubmitBtnDisabled }"
      class="member-form-btn" type="submit">登入</button>
    <router-link class="border-b border-travel-gray mt-[50px] text-[14px] text-travel-gray tracking-[1px]" :to="{ name: 'ForgotPassword' }">忘記密碼？</router-link>
  </form>
</template>