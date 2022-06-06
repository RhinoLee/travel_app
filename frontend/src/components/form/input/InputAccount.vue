<script setup>
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  email: {
    type: String
  }
})
const emit = defineEmits(["update:email"])

const inputParams = {
  inputName: "信箱帳號",
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