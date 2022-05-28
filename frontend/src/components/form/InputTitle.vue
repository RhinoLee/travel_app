<script setup>
import { watch, onBeforeUnmount, onMounted } from "vue"
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

const { errors, validateInit, validateTitleInput } = useInputValidator()
const validateInput = () => {
  validateTitleInput(inputParams);
  emit("update:title", inputParams.value);
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
    <div v-if="errors[inputParams.inputKey]" class="text-red-500">{{ errors[inputParams.inputKey] }}</div>
  </div>
</template>