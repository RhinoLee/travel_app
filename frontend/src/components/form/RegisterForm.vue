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
  <form @submit.prevent="submitHandler" class="form" novalidate>
    <InputAccount v-model:email="formParams.email"></InputAccount>
    <InputPassword v-model:password="formParams.password"></InputPassword>
    <InputPasswordRepeat v-model:repassword="formParams.repassword" :password="formParams.password">
    </InputPasswordRepeat>

    <button :disabled="isSubmitBtnDisabled"
      :class="{ 'shadow-travel-textgreen': !isSubmitBtnDisabled, 'bg-travel-textgreen': !isSubmitBtnDisabled, 'shadow-disabled': isSubmitBtnDisabled, 'bg-disabled': isSubmitBtnDisabled }"
      class="member-form-btn" type="submit">註冊</button>
  </form>
</template>