<script setup>
import { useMemberStore } from "@/stores/member"
import { storeToRefs } from 'pinia'
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"


const memberStore = useMemberStore()
const { isDeleteAccountBoxOpen, deleteMember } = storeToRefs(memberStore)

const emit = defineEmits(["deleteHandler"])

const { errors } = useInputValidator()
const { isSubmitBtnDisabled } = useSubmitBtnState(unref(deleteMember), errors)

function submitHandler() {
  memberStore.isDeleteAccountBoxOpen = false
  emit("deleteHandler")
}

</script>
<template>
  <!-- 確認刪除 -->
  <LightBox v-model:isBoxOpen="isDeleteAccountBoxOpen">
    <template v-slot:title>刪除帳號</template>
    <template v-slot:submit-btn>
      <button @click="submitHandler" :disabled="isSubmitBtnDisabled" 
      :class="{ 'bg-disabled': isSubmitBtnDisabled, 'bg-alert': !isSubmitBtnDisabled }"
      class="lightbox-submit-btn" type="button">刪除</button>
    </template>
    <template v-slot:main>
      <div>請輸入信箱帳號，確認刪除帳號</div>
      <form class="form" novalidate>
        <InputDeleteAccount v-model:deleteEmail="memberStore.deleteMember.deleteEmail" :email="memberStore.memberInfo.email">
        </InputDeleteAccount>
      </form>

      <div class="text-alert">刪除帳號後，相關資料將無法還原</div>
    </template>
  </LightBox>
</template>