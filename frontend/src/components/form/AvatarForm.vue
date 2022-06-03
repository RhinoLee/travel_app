<script setup>
import { reactive } from "vue";
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import InputAvatar from "@/components/form/input/InputAvatar.vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import LightBox from "@/components/common/LightBox.vue"

const memberStore = useMemberStore()
const { memberInfo, isEditBoxOpen } = storeToRefs(memberStore)

const formParams = reactive({
  avatar: "",
})

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(formParams, errors)

async function uploadAvatar() {
  memberStore.avatarFile = formParams.avatar
  await memberStore.updateAvatar()
  memberStore.isEditBoxOpen = false
}

</script>

<template>
  <LightBox v-model:isBoxOpen="memberStore.isEditBoxOpen">
    <template v-slot:title>編輯頭像</template>
    <template v-slot:submit-btn>
      <div class="flex">
        <button @click="hideBox" type="button" class="mr-4 bg-disabled lightbox-submit-btn">Cancel</button>
        <button :disabled="isSubmitBtnDisabled" @click="uploadAvatar" type="button"
          class="bg-travel-textgreen lightbox-submit-btn">Submit</button>
      </div>
    </template>
    <template v-slot:main>
      <form @submit.prevent class="w-full h-full flex flex-col items-start" novalidate>
        <InputAvatar :avatar="memberInfo.avatar" :isBoxOpen="memberStore.isEditBoxOpen"
          v-model:avatar="formParams.avatar">
        </InputAvatar>
      </form>
    </template>
  </LightBox>
</template>