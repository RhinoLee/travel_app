<script setup>
import robot from "@/assets/images/png/robot.png"
import useInputValidator from "@/composition-api/useInputValidator"
import iconUploadImg from "@/assets/images/svg/icon_uploadimg.svg"
import iconCancel from "@/assets/images/svg/icon_cancel.svg"

const props = defineProps({
  avatar: {
    type: [Object, String]
  },
  avatarUrl: {
    type: String
  },
  isBoxOpen: {
    type: Boolean
  },
  deleteAvatar: {
    type: Boolean
  }
})

const emit = defineEmits(["update:avatar", "update:deleteAvatar"])

const fileInput = ref(null)
const image = reactive({ src: "" })

const inputParams = {
  inputName: "頭像",
  inputKey: "avatarFile",
  value: ""
}

const { errors, validateInit, validateSingeImageInput } = useInputValidator()

const validateInput = () => {
  validateSingeImageInput(inputParams);
}

// 偵測編輯頭像開 or 關
// watch(
//   () => props.isBoxOpen,
//   (newVal) => {
//     if (newVal) return
//     clearInput()
//     validateInput()
//   }
// )

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
      emit("update:deleteAvatar", false)
    })

    reader.readAsDataURL(files[0])
  }
}

function clearInput() {
  fileInput.value.value = ""
  inputParams.value = ""
  image.src = ""

  emit("update:avatar", null)

// 如果上 avatarUrl 有值（原資料有封面照連結），代表 user 要刪除照片
  if (props.avatarUrl) emit("update:deleteAvatar", true)
  else emit("update:deleteAvatar", false)
}

onMounted(() => {
  image.src = props.avatarUrl
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
      <div class="relative m-auto w-[88px] border rounded-full overflow-hidden">
        <DefaultAvatar height="h-[88px]" :picture="image.src"></DefaultAvatar>
      </div>
      <div v-if="errors[inputParams.inputKey]" class="text-alert text-center">{{ errors[inputParams.inputKey] }}</div>
      <!-- buttons -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
        <button @click="chooseImage" type="button"
          class="icon-circle-small group-hover:opacity-100 group-hover:pointer-events-auto">
          <img :src="iconUploadImg" class="w-full h-full object-contain" alt="選擇圖片">
        </button>
        <button v-if="image.src" @click="clearInput" type="button"
          :class="{ 'group-hover:opacity-100': image.src, 'group-hover:pointer-events-auto': image.src }"
          class="icon-circle-small">
          <img :src="iconCancel" class="w-full h-full object-contain" alt="取消">
        </button>
      </div>
    </div>
  </div>
  <input class="hidden" ref="fileInput" type="file" @input="onSelectFile">
</template>