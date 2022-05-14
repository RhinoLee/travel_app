<script setup>
import { ref, reactive } from "vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAccount from "@/components/form/InputAccount.vue";
import InputPassword from "@/components/form/InputPassword.vue";

const loginParams = reactive({
  email: "",
  password: "",
})

const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSignInBtnDisabled } = useSubmitBtnState(loginParams, errors)

function submitHandler() {
  emit("submitHandler", loginParams)
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="h-full flex flex-col items-start" novalidate>
    <InputAccount v-model:email="loginParams.email"></InputAccount>
    <InputPassword v-model:password="loginParams.password"></InputPassword>

    <button :disabled="isSignInBtnDisabled" type="submit" class="mt-auto block px-4 py-2 shadow-lg">Submit</button>
  </form>
</template>