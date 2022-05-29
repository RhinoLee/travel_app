<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from "vue"
import robot from "@/assets/images/png/robot.png"
import useInputValidator from "@/composition-api/useInputValidator"

const props = defineProps({
  avatar: {
    type: String
  }, 
  isBoxOpen: {
    type: Boolean
  }
})

const emit = defineEmits(["update:avatar"])

const fileInput = ref(null)
const image = reactive({ src: "" })

const avatarSrc = computed(() => {
  return image.src ? image.src : robot
})

const inputParams = {
  inputName: "頭像",
  inputKey: "avatar",
  value: ""
}

const { errors, validateInit, validateSingeImageInput } = useInputValidator()

const validateInput = () => {
  validateSingeImageInput(inputParams);
}

// 偵測編輯頭像開 or 關
watch(
  () => props.isBoxOpen,
  (newVal) => {
    if (newVal) return
    clearInput()
    validateInput()
  }
)

function chooseImage() {
  clearInput()
  fileInput.value.click()
}

function onSelectFile() {
  const files = fileInput.value.files
  if (files && files[0]) {
    const reader = new FileReader
    reader.addEventListener("load", function (e) {
      inputParams.value = files[0]
      image.src = e.target.result
      validateInput()
      emit("update:avatar", inputParams.value)
    })

    reader.readAsDataURL(files[0])
  }
}

function clearInput() {
  fileInput.value.value = ""
  inputParams.value = ""
  image.src = ""
}

onMounted(() => {
  validateInput()
})

onBeforeUnmount(() => {
  validateInit()
})

</script>

<template>
  <div class="flex justify-center w-full mb-[40px] mt-[10px]">
    <div class="relative w-[120px] h-[120px] border rounded-full overflow-hidden">
      <img v-if="image.src" :src="image.src" class=" w-full h-full object-cover object-center">
    </div>
  </div>

  <div class="flex justify-center w-full">
    <div>
      <button @click="chooseImage" type="button" class="border px-4 py-2">
        請選擇照片
      </button>
      <div v-if="errors[inputParams.inputKey]" class="text-alert text-center">{{ errors[inputParams.inputKey] }}</div>
    </div>

    <input class="hidden" ref="fileInput" type="file" @input="onSelectFile">
  </div>
</template>