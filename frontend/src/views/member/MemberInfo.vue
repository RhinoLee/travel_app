<script setup>
import { reactive, computed } from "vue"
import { storeToRefs } from 'pinia'
import { useMemberStore } from "@/stores/member"
import useInputValidator from "@/composition-api/useInputValidator"
import useSubmitBtnState from "@/composition-api/useSubmitBtnState"
import InputAvatar from "@/components/form/input/InputAvatar.vue"
import LandingPage from "@/components/member/LandingPage.vue"

const memberStore = useMemberStore()
const { memberInfo } = storeToRefs(memberStore)

const { errors } = useInputValidator()
const canBeEmptyKeys = ["deleteAvatar", "avatarFile"]
const { isSubmitBtnDisabled } = useSubmitBtnState(memberStore.editMemberParams, errors, canBeEmptyKeys)

const disabledComputed = computed(() => {
  return memberStore.editMemberParams.avatarFile === null && !memberStore.editMemberParams.deleteAvatar
})

async function uploadAvatar() {
  await memberStore.updateAvatar()
}

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
      <footer>
        <button :disabled="isSubmitBtnDisabled || disabledComputed" @click="uploadAvatar"
          :class="{ 'bg-disabled': isSubmitBtnDisabled || disabledComputed, 'bg-travel-textgreen': !isSubmitBtnDisabled && !disabledComputed }"
          class="lightbox-submit-btn mt-[62px]">儲存</button>
      </footer>
    </template>
  </LandingPage>


  <!-- <div>
    <div class="relative w-screen h-screen">
      <div
        class="absolute flex flex-col w-[500px] h-[400px] px-10 py-8 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-white">
        <header class="mb-[20px]">
          <h1 class="font-bold text-lg">用戶資訊</h1>
        </header>
        <main class="h-full">
          <div class="flex justify-center mb-[40px] mt-[10px]">
            <InputAvatar v-model:avatar="memberStore.editMemberParams.avatarFile"
              v-model:deleteAvatar="memberStore.editMemberParams.deleteAvatar"
              :avatarUrl="memberStore.memberInfo.avatar">
            </InputAvatar>
          </div>
          <ul>
            <li><span>帳號：</span><span>{{ memberInfo.email }}</span></li>
          </ul>
        </main>
        <footer>
          <button :disabled="isSubmitBtnDisabled || disabledComputed" @click="uploadAvatar"
            :class="{ 'bg-disabled': isSubmitBtnDisabled || disabledComputed, 'bg-travel-textgreen': !isSubmitBtnDisabled && !disabledComputed }"
            class="lightbox-submit-btn">儲存</button>
        </footer>
      </div>
    </div>
  </div> -->
</template>