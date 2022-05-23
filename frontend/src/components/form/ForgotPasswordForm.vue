<script setup>
import { unref } from "vue"
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAccount from "@/components/form/InputAccount.vue";

const memberStore = useMemberStore()
const { forgotPasswordParams } = storeToRefs(memberStore)
const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSignInBtnDisabled } = useSubmitBtnState(unref(forgotPasswordParams), errors)

function submitHandler() {
  emit("submitHandler")
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="h-full flex flex-col items-start" novalidate>
    <InputAccount v-model:email="memberStore.forgotPasswordParams.email"></InputAccount>

    <div class="flex items-center mt-auto">
      <button :disabled="isSignInBtnDisabled" type="submit" class="block px-4 py-2 shadow-lg">發送驗證信</button>
    </div>
  </form>
</template>