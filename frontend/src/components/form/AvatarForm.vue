<script setup>
import { reactive } from "vue";
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import InputAvatar from "@/components/form/InputAvatar.vue"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import LightBox from "@/components/common/LightBox.vue"

const memberStore = useMemberStore()
const { memberInfo, isEditBoxOpen } = storeToRefs(memberStore)

const formParams = reactive({
  avatar: "",
})

const { errors } = useInputValidator()
const { isSignInBtnDisabled } = useSubmitBtnState(formParams, errors)

async function uploadAvatar() {
  memberStore.avatarFile = formParams.avatar
  await memberStore.updateAvatar()
  memberStore.isEditBoxOpen = false
}

</script>

<template>
  <LightBox v-model:isBoxOpen="memberStore.isEditBoxOpen">
    <template v-slot:header>編輯頭像</template>
    <template v-slot:main>
      <form @submit.prevent class="w-full h-full flex flex-col items-start" novalidate>
        <InputAvatar :avatar="memberInfo.avatar" :isBoxOpen="memberStore.isEditBoxOpen" v-model:avatar="formParams.avatar">
        </InputAvatar>
      </form>
    </template>
    <template v-slot:footer>
      <div class="flex w-full">
        <button @click="hideBox" type="button" class="block mt-auto mr-4 px-4 py-2 shadow-lg">Cancel</button>
        <button :disabled="isSignInBtnDisabled" @click="uploadAvatar" type="button" class="mt-auto block px-4 py-2 shadow-lg">Submit</button>
      </div>
    </template>
  </LightBox>
</template>