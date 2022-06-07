<script setup>
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"

const memberStore = useMemberStore()
const { forgotPasswordParams } = storeToRefs(memberStore)
const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(unref(forgotPasswordParams), errors)

function submitHandler() {
  emit("submitHandler")
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="form" novalidate>
    <InputAccount v-model:email="memberStore.forgotPasswordParams.email"></InputAccount>

    <div class="flex items-center mt-auto">
      <button :disabled="isSubmitBtnDisabled" 
      class="member-form-btn"
      :class="{ 'shadow-travel-textgreen': !isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled, 'shadow-disabled': isSubmitBtnDisabled, 'bg-disabled': isSubmitBtnDisabled }"
      type="submit">發送驗證信</button>
    </div>
  </form>
</template>