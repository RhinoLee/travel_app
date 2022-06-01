<script setup>
import { ref, reactive } from "vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAccount from "@/components/form/input/InputAccount.vue";
import InputPassword from "@/components/form/input/InputPassword.vue";
import InputPasswordRepeat from "@/components/form/input/InputPasswordRepeat.vue";

const formParams = reactive({
  email: "",
  password: "",
  repassword: "",
})

const emit = defineEmits(["submitHandler"])

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(formParams, errors)

function submitHandler() {
  emit("submitHandler", formParams)
}

</script>
<template>
  <form @submit.prevent="submitHandler" class="h-full flex flex-col items-start" novalidate>
    <InputAccount v-model:email="formParams.email"></InputAccount>
    <InputPassword v-model:password="formParams.password"></InputPassword>
    <InputPasswordRepeat v-model:repassword="formParams.repassword" :password="formParams.password"></InputPasswordRepeat>

    <button :disabled="isSubmitBtnDisabled" type="submit" class="mt-auto block px-4 py-2 shadow-lg">Submit</button>
  </form>
</template>