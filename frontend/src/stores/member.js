import { defineStore } from "pinia"
// import { apiRegister, apiLogin, apiMemberInfo, apiRefreshToken } from "@/utils/api/api"
import { errorHandler } from "@/utils/errorHandler"
import robot from "@/assets/images/png/robot.png"

export const useMemberStore = defineStore("member", {
  state: () => {
    return {
      isLogin: false,
      isRefreshing: false,
      refreshedCall: [],
      registerParams: {
        email: "",
        password: "",
        repassword: ""
      },
      loginParams: {
        email: "",
        password: "",
      },
      forgotPasswordParams: {
        email: "",
      },
      resetPasswordParams: {
        password: "",
        repassword: ""
      },
      editMemberParams: {
        avatarFile: null,
        deleteAvatar: false
      },
      deleteMember: {
        deleteEmail: "",
      },
      memberInfo: {
        id: null,
        email: "",
        avatar: "",
        nickName: "",
      },
      verifyMemberEmail: null,
      // light box state
      isEditBoxOpen: false,
      isErrorBoxOpen: false,
      isNotVerifyBoxOpen: false,
      isVerifyResultBoxOpen: false,
      isRegisterResultBoxOpen: false,
      isResetPasswordResultBoxOpen: false,
      isDeleteAccountBoxOpen: false,
      isDeleteResultBoxOpen: false,
    }
  },
  getters: {
    memberName() {
      if (!this.memberInfo) return ""
      if (this.memberInfo.nickName) return this.memberInfo.nickName
      if (this.memberInfo.email) {
        const account = this.memberInfo.email.split("@")[0]
        return account
      }
    }
  },
  actions: {
    clearLoginParams() {
      this.loginParams.email = ""
      this.loginParams.password = ""
    },
    clearRegisterParams() {
      this.registerParams.email = ""
      this.registerParams.password = ""
      this.registerParams.repassword = ""
    },
    clearEditMemberParams() {
      this.editMemberParams.avatarFile = null
      this.editMemberParams.deleteAvatar = false
    },
    async registerHandler() {
      try {
        const result = await this.$axios.api.apiRegister(this.registerParams)
        this.clearRegisterParams()
        if (result && result.data.success) return result.data
      } catch (error) {
        this.clearRegisterParams()
        return error.response.data
      }
    },
    async loginHandler() {
      try {
        const result = await this.$axios.api.apiLogin(this.loginParams)
        this.clearLoginParams()

        if (result && result.data.success) {
          const token = result.headers.authorization.split(" ")[1]
          const refreshToken = result.data.refreshToken
          localStorage.setItem("token", token)
          localStorage.setItem("refreshToken", refreshToken)
          this.token = token
          this.isLogin = true
        }
        return result.data
      } catch (error) {
        this.clearLoginParams()
        return error.response.data
      }
    },
    async getMemberInfo() {
      const token = localStorage.getItem("token")
      if (!token) return false

      try {
        const getMemberResult = await this.$axios.api.apiMemberInfo()
        if (getMemberResult.data.success) {
          this.isLogin = true
          this.memberInfo = getMemberResult.data.memberInfo
        }

        return getMemberResult.data.success
      } catch (err) {
        return false
      }
    },
    async updateAvatar() {
      const formData = new FormData()
      formData.append("deleteAvatar", this.editMemberParams.deleteAvatar)
      formData.append("avatar", this.editMemberParams.avatarFile)

      const result = await this.$axios.api.apiUpdateAvatar(formData)
      if (result.data.success) {
        this.memberInfo.avatar = result.data.avatar
      }

      this.clearEditMemberParams()
    },
    async refreshTokenHandler() {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) return Promise.reject(false)
      // apiRefreshToken
      const result = await this.$axios.api.apiRefreshToken(refreshToken)
      if (result && result.data.success) {

        const token = result.data.accessToken
        const refreshToken = result.data.refreshToken
        localStorage.setItem("token", token)
        localStorage.setItem("refreshToken", refreshToken)

        return Promise.resolve(result)
      }
      return Promise.reject(false)
    },
    async verifyMember(token) {
      try {
        const result = await this.$axios.api.apiVerifyMember(token)
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async verifyEmail(email) {
      if (!email) return
      try {
        const result = await this.$axios.api.apiVerifyEmail({ email })
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async resetPasswordEmail(email) {
      if (!email) return
      try {
        const result = await this.$axios.api.apiResetPasswordEmail({ email })
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async resetPasswordHandler(token) {
      if (!token) return
      try {
        const params = this.resetPasswordParams
        const result = await this.$axios.api.apiResetPassword(token, params)
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async deleteAccountHandler() {
      try {
        const params = this.resetPasswordParams
        const result = await this.$axios.api.apiDeleteMember()
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    logoutHandler() {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      this.isLogin = false
      this.memberInfo = {
        id: null,
        email: "",
      }
    },
  }
})