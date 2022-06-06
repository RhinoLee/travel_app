<script setup>
import { useMemberStore } from "@/stores/member"
import { useCommonStore } from "@/stores/common"
import { storeToRefs } from 'pinia'

const memberStore = useMemberStore()
const commonStore = useCommonStore()
const { isLogin } = storeToRefs(memberStore)

function closeUserMenu() {
  commonStore.isUserMunuOpen = false
}

onMounted(() => {
  window.addEventListener("click", () => closeUserMenu())
})

onBeforeUnmount(() => {
  closeUserMenu()
  window.removeEventListener("click", closeUserMenu)
})

</script>

<template>
  <div class="h-full">
    <Header v-if="isLogin"></Header>
    <RouterView />
    <Sidebar v-if="isLogin"></Sidebar>
  </div>
  <Loading></Loading>
</template>