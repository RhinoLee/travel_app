<script setup>
import { computed, ref, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAvatar from "@/components/form/input/InputAvatar.vue"
import LandingPage from "@/components/member/LandingPage.vue"
import LightBox from "@/components/common/LightBox.vue"
import DeleteAccountForm from "@/components/form/DeleteAccountForm.vue"

const router = useRouter()
const memberStore = useMemberStore()
const { memberInfo, isDeleteAccountBoxOpen } = storeToRefs(memberStore)
const { errors } = useInputValidator()
const canBeEmptyKeys = ["deleteAvatar", "avatarFile"]
const { isSubmitBtnDisabled } = useSubmitBtnState(memberStore.editMemberParams, errors, canBeEmptyKeys)
const verifyMsg = ref("")
let redirectTimeout = null

const disabledComputed = computed(() => {
  return memberStore.editMemberParams.avatarFile === null && !memberStore.editMemberParams.deleteAvatar
})

async function uploadAvatar() {
  await memberStore.updateAvatar()
}

async function deleteHandler() {
  try {
    const result = await memberStore.deleteAccountHandler()

    if (result.success) {
      verifyMsg.value = "帳號刪除成功"
      memberStore.logoutHandler()
    }
    else verifyMsg.value = "帳號刪除失敗，請稍後再嘗試"

    memberStore.isDeleteResultBoxOpen = true

    redirectTimeout = setTimeout(() => {
      hideBox('isDeleteResultBoxOpen')
      router.push({ name: "Login" })
    }, 3000)


  } catch (err) {
    verifyMsg.value = "帳號刪除失敗，請稍後再嘗試"
    memberStore.isDeleteResultBoxOpen = true
  }
}

function hideBox(boxname) {
  memberStore[boxname] = false
}

onBeforeUnmount(() => {
  clearTimeout(redirectTimeout)
})

</script>
<template>
  <LandingPage :hasLogo="false" :hasHeader="true">
    <template v-slot:nav>
      <div class="member-form-nav">
        <span class="member-form-nav-text-active">個人資訊</span>
      </div>
    </template>
    <template v-slot:form>
      <main class="h-full">
        <div class="flex justify-center mb-[40px] mt-[10px]">
          <InputAvatar v-model:avatar="memberStore.editMemberParams.avatarFile"
            v-model:deleteAvatar="memberStore.editMemberParams.deleteAvatar" :avatarUrl="memberStore.memberInfo.avatar">
          </InputAvatar>
        </div>
        <ul>
          <li><span>帳號：</span><span>{{ memberInfo.email }}</span></li>
        </ul>
      </main>
      <footer class="flex justify-center mt-[62px]">
        <button :disabled="isSubmitBtnDisabled || disabledComputed" @click="uploadAvatar"
          :class="{ 'bg-disabled': isSubmitBtnDisabled || disabledComputed, 'bg-travel-textgreen': !isSubmitBtnDisabled && !disabledComputed }"
          class="lightbox-submit-btn mx-[10px]">儲存</button>

        <button @click="memberStore.isDeleteAccountBoxOpen = true"
          class="lightbox-submit-btn mx-[10px] bg-alert">刪除帳號</button>
      </footer>
    </template>
  </LandingPage>

  <!-- 刪除帳號 -->
  <DeleteAccountForm @deleteHandler="deleteHandler"></DeleteAccountForm>

  <LightBox v-model:isBoxOpen="memberStore.isDeleteResultBoxOpen">
    <template v-slot:title>刪除帳號通知</template>
    <template v-slot:main>
      <div>{{ verifyMsg }}</div>
    </template>
  </LightBox>
</template>