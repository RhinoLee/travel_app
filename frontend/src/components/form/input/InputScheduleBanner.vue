<script setup>
import useInputValidator from "@/composition-api/useInputValidator"
import iconUploadImg from "@/assets/images/svg/icon_uploadimg.svg"
import iconCancel from "@/assets/images/svg/icon_cancel.svg"

const props = defineProps({
  picture: {
    type: [Object, String]
  },
  pictureUrl: {
    type: String
  },
  isBoxOpen: {
    type: Boolean
  },
  deletePicture: {
    type: Boolean
  }
})

const emit = defineEmits(["update:picture", "update:deletePicture"])

const fileInput = ref(null)
const image = reactive({ src: "" })

const inputParams = {
  inputName: "封面",
  inputKey: "picture",
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
  // clearInput()
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
      emit("update:picture", inputParams.value)
      emit("update:deletePicture", false)
    })

    reader.readAsDataURL(files[0])
  }
}

function clearInput() {
  fileInput.value.value = ""
  inputParams.value = ""
  image.src = ""
  // image.src = props.pictureUrl
  emit("update:picture", null)

  // 如果上 pictureUrl 有值（原資料有封面照連結），代表 user 要刪除照片
  if (props.pictureUrl) emit("update:deletePicture", true)
  else emit("update:deletePicture", false)
}

onMounted(() => {
  image.src = props.pictureUrl
  // validateInput()
})

onBeforeUnmount(() => {
  validateInit()
})

</script>

<template>
  <div class="flex justify-center w-full">
    <div class="group relative w-full blur-mask">
      <!-- <img v-if="image.src" :src="image.src" class=" w-full h-full object-cover object-center"> -->
      <DefaultImage height="pt-[45%]" :picture="image.src"></DefaultImage>
      <!-- buttons -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
        <button @click="chooseImage" type="button"
          class="icon-circle group-hover:opacity-100 group-hover:pointer-events-auto">
          <img :src="iconUploadImg" class="w-full h-full object-contain" alt="選擇圖片">
        </button>
        <button v-if="image.src" @click="clearInput" type="button"
          :class="{ 'group-hover:opacity-100': image.src, 'group-hover:pointer-events-auto': image.src }"
          class="icon-circle">
          <img :src="iconCancel" class="w-full h-full object-contain" alt="取消">
        </button>
      </div>
    </div>
  </div>
  <div v-if="errors[inputParams.inputKey]" class="text-alert text-center">{{ errors[inputParams.inputKey] }}</div>
  <div class="flex justify-center w-full">

    <input class="hidden" ref="fileInput" type="file" @input="onSelectFile">
  </div>
</template>