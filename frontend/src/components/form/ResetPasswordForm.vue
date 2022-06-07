<script setup>
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"


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
  <form @submit.prevent="submitHandler" class="form" novalidate>
    <InputPassword v-model:password="memberStore.resetPasswordParams.password"></InputPassword>
    <InputPasswordRepeat v-model:repassword="memberStore.resetPasswordParams.repassword" :password="memberStore.resetPasswordParams.password"></InputPasswordRepeat>

    <button :disabled="isSubmitBtnDisabled" 
    :class="{ 'shadow-travel-textgreen': !isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled, 'shadow-disabled': isSubmitBtnDisabled, 'bg-disabled': isSubmitBtnDisabled }"
    class="member-form-btn" type="submit">Submit</button>
  </form>
</template>