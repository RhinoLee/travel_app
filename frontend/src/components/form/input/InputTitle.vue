<script setup>
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  title: {
    type: String
  }
})
const emit = defineEmits(["update:title"])
const inputParams = {
  inputName: "名稱",
  inputKey: "title",
  value: ""
}

watch(
  () => props.title,
  (newVal) => {
    if (newVal === "") return inputParams.value = ""
    if (!inputParams.value) inputParams.value = newVal
  },
  { immediate: true }
)

const { errors, validateInit, validateRequiredInput } = useInputValidator()
const validateInput = () => {
  validateRequiredInput(inputParams);
  emit("update:title", inputParams.value);
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
    <input v-model.trim="inputParams.value" @input="validateInput" @blur="validateInput" type="text"
      :id="inputParams.inputKey" class="input" placeholder="Title">
    <div v-if="errors[inputParams.inputKey]" class="text-alert">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>