<script setup>
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
watch(
  () => props.repassword,
  (newVal) => {
    if (newVal === "") inputParams.value = ""
  }
)

const { errors, validateInit, validatePasswordIRepeatnput } = useInputValidator()
const validateInput = () => {
  validatePasswordIRepeatnput(inputParams, props.password);
  emit("update:repassword", inputParams.value);
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
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" :disabled="!props.password" type="password" :id="inputParams.inputKey"
      class="input" placeholder="Password">
    <div v-if="errors[inputParams.inputKey]" class="text-alert">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>