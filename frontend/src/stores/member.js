import { defineStore } from "pinia"
import { apiRegister, apiLogin, apiMemberInfo } from "@/utils/api/api"
import { errorHandler } from "../utils/api/errorHandler"

export const useMemberStore = defineStore("member", {
  state: () => {
    return {
      isLogin: false,
      registerParams: {
        email: "",
        password: "",
        repassword: ""
      },
      loginParams: {
        email: "",
        password: "",
      },
      memberInfo: {
        id: null,
        email: "",
      }
    }
  },
  getters: {

  },
  actions: {
    async registerHandler() {
      const result = await apiRegister(this.registerParams)
      if (result) return result.data.success
      return false
    },
    async loginHandler() {
      const result = await apiLogin(this.loginParams)
      if (result && result.data.success) {

        const token = result.headers.authorization.split(" ")[1]
        localStorage.setItem("token", token)
        this.isLogin = true

        return result.data.success
      }
      return false
    },
    async getMemberInfo() {
      const token = localStorage.getItem("token")
      if (!token) return false

      try {
        const getMemberResult = await apiMemberInfo()
        if (getMemberResult.data.success) {
          this.isLogin = true
          this.memberInfo = getMemberResult.data.memberInfo
        }

        return getMemberResult.data.success
      } catch (err) {
        errorHandler.catchError(err)
        return false
      }
    },
    logoutHandler() {
      localStorage.removeItem("token")
      this.isLogin = false
      this.memberInfo = {
        id: null,
        email: "",
      }
    }
  }
})