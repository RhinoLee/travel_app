import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
  state: () => {
    return {
      isLoading: false,
    }
  },
  getters: {

  },
  actions: {
    trigger(val) {
      this.isLoading = val
    }
  }
})