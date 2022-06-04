import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
  state: () => {
    return {
      isLoading: false,
      isMenuOpen: false,
      isMenuMaskOpen: false,
      isUserMunuOpen: false
    }
  },
  getters: {

  },
  actions: {
    trigger(val) {
      this.isLoading = val
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
      this.isMenuMaskOpen = !this.isMenuMaskOpen
    },
    toggleUserMenu() {
      this.isUserMunuOpen = !this.isUserMunuOpen
    },
  }
})