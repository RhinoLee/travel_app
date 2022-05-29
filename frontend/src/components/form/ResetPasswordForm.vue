<script setup>
import { ref, reactive, unref } from "vue"
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAccount from "@/components/form/InputAccount.vue";
import InputPassword from "@/components/form/InputPassword.vue";
import InputPasswordRepeat from "@/components/form/InputPasswordRepeat.vue";


const memberStore = useMemberStore()
const { resetPasswordParams } = storeToRefs(memberStore)

const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(unref(resetPasswordParams), errors)

function submitHandler() {
  emit("submitHandler")
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="h-full flex flex-col items-start" novalidate>
    <InputPassword v-model:password="memberStore.resetPasswordParams.password"></InputPassword>
    <InputPasswordRepeat v-model:repassword="memberStore.resetPasswordParams.repassword" :password="memberStore.resetPasswordParams.password"></InputPasswordRepeat>

    <button :disabled="isSubmitBtnDisabled" type="submit" class="mt-auto block px-4 py-2 shadow-lg">Submit</button>
  </form>
</template>