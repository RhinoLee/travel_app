<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue"
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  deleteEmail: {
    type: String
  },
  email: {
    type: String
  }
})
const emit = defineEmits(["update:deleteEmail"])

const inputParams = {
  inputName: "信箱帳號",
  inputKey: "deleteEmail",
  value: ""
}

watch(
  () => props.deleteEmail,
  (newVal) => {
    if (newVal === "") inputParams.value = ""
  }
)

const { errors, validateInit, validateDeleteAccount } = useInputValidator()
const validateInput = () => {
  validateDeleteAccount(inputParams, props.email);
  emit("update:deleteEmail", inputParams.value);
}

onMounted(() => {
  validateInit()
})

onBeforeUnmount(() => {
  validateInit()
})

</script>
<template>
  <div class="mt-[10px] w-full">
    <label :for="inputParams.inputKey" class="label">{{ inputParams.inputName }}</label>
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" type="email" :id="inputParams.inputKey"
      class="input" placeholder="E-mail">
    <div v-if="errors[inputParams.inputKey]" class="text-alert">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>