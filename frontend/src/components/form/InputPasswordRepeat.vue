<script setup>
import { watch } from "vue"
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  password: {
    type: String
  },
  repassword: {
    type: String
  }
})
const emit = defineEmits(["update:repassword"])
const inputParams = {
  inputName: "確認密碼",
  inputKey: "repassword",
  value: ""
}

watch(
  () => props.password,
  (newVal) => {
    validateInput()
  }
)

const { errors, validatePasswordIRepeatnput } = useInputValidator()
const validateInput = () => {
  validatePasswordIRepeatnput(inputParams, props.password);
  emit("update:repassword", inputParams.value);
}

</script>
<template>
  <div class="mt-[10px] w-full">
    <label :for="inputParams.inputKey" class="block py-1">{{ inputParams.inputName }}</label>
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" :disabled="!props.password" type="text" :id="inputParams.inputKey"
      class="w-full px-2 py-2 border outline-none">
    <div v-if="errors[inputParams.inputKey]" class="text-red-500">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>