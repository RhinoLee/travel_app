<script setup>
import { onBeforeUnmount, watch } from "vue"
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  email: {
    type: String
  }
})
const emit = defineEmits(["update:email"])

const inputParams = {
  inputName: "帳號",
  inputKey: "email",
  value: ""
}

watch(
  () => props.email,
  (newVal) => {
    if (newVal === "") inputParams.value = ""
  }
)

const { errors, validateInit, validateAccountInput } = useInputValidator()
const validateInput = () => {
  validateAccountInput(inputParams);
  emit("update:email", inputParams.value);
}

onBeforeUnmount(() => {
  validateInit()
})

</script>
<template>
  <div class="mt-[10px] w-full">
    <label :for="inputParams.inputKey" class="block py-1">{{ inputParams.inputName }}（請填寫信箱）</label>
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" type="text" :id="inputParams.inputKey"
      class="w-full px-2 py-2 border outline-none">
    <div v-if="errors[inputParams.inputKey]" class="text-alert">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>