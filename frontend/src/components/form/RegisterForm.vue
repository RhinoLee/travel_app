<script setup>
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"

const memberStore = useMemberStore()
const { registerParams } = storeToRefs(memberStore)

const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(memberStore.registerParams, errors)

function submitHandler() {
  emit("submitHandler", registerParams)
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="form" novalidate>
    <InputAccount v-model:email="memberStore.registerParams.email"></InputAccount>
    <InputPassword v-model:password="memberStore.registerParams.password"></InputPassword>
    <InputPasswordRepeat v-model:repassword="memberStore.registerParams.repassword" :password="memberStore.registerParams.password">
    </InputPasswordRepeat>

    <button :disabled="isSubmitBtnDisabled"
      :class="{ 'shadow-travel-textgreen': !isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled, 'shadow-disabled': isSubmitBtnDisabled, 'bg-disabled': isSubmitBtnDisabled }"
      class="member-form-btn" type="submit">註冊</button>
  </form>
</template>