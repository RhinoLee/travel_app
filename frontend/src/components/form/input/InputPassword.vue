<script setup>
import { watch, onBeforeUnmount, onMounted } from "vue"
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
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" type="password"
      :id="inputParams.inputKey" class="input" placeholder="Password">
    <div v-if="errors[inputParams.inputKey]" class="text-alert">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>