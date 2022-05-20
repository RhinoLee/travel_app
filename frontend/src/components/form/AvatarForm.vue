<script setup>
import { reactive } from "vue";
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import InputSingleImage from "@/components/form/InputSingleImage.vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"

const memberStore = useMemberStore()
const { memberInfo } = storeToRefs(memberStore)

const props = defineProps({
  isBoxOpen: {
    type: Boolean
  },
})

const formParams = reactive({
  avatar: "",
})

const emit = defineEmits(["submitHandler", "cancelHandler"])

const { errors } = useInputValidator()
const { isSignInBtnDisabled } = useSubmitBtnState(formParams, errors)

function submitHandler() {
  emit("submitHandler", formParams)
}

function cancelHandler() {
  emit("cancelHandler")
}

</script>

<template>
  <form @submit.prevent="submitHandler" class="w-full h-full flex flex-col items-start" novalidate>
    <InputSingleImage :avatar="memberInfo.avatar" :isBoxOpen="isBoxOpen" v-model:avatar="formParams.avatar"></InputSingleImage>
    <div class="flex justify-center mt-10 w-full">
      <button @click="cancelHandler" type="button" class="block mt-auto mr-4 px-4 py-2 shadow-lg">Cancel</button>
      <button :disabled="isSignInBtnDisabled" type="submit" class="mt-auto block px-4 py-2 shadow-lg">Submit</button>
    </div>
  </form>
</template>