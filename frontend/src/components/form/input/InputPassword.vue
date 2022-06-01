<script setup>
import { watch, onBeforeUnmount } from "vue"
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  password: {
    type: String
  }
})
const emit = defineEmits(["update:password"])
const inputParams = {
  inputName: "密碼",
  inputKey: "password",
  value: ""
}

watch(
  () => props.password,
  (newVal) => {
    if (newVal === "") inputParams.value = ""
  }
)

const { errors, validateInit, validatePasswordInput } = useInputValidator()
const validateInput = () => {
  validatePasswordInput(inputParams);
  emit("update:password", inputParams.value);
}

onBeforeUnmount(() => {
  validateInit()
})

</script>
<template>
  <div class="mt-[10px] w-full">
    <label :for="inputParams.inputKey" class="block py-1">{{ inputParams.inputName }}</label>
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" type="text"
      :id="inputParams.inputKey" class="w-full px-2 py-2 border outline-none">
    <div v-if="errors[inputParams.inputKey]" class="text-alert">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>