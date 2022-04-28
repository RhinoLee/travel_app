import router from "../../router/index"
import { useMemberStore } from "@/stores/member"

const errorHandler = {
  catchError: async (error) => {
    console.log("catchError", error);
    if (error.response.status === 401) {
      return errorHandler.handle401(error)
    }
  },
  handle401: (error) => {
    const memberStore = useMemberStore()
    console.log("handle401", error);
    memberStore.isLogin = false
    memberStore.memberInfo = { id: null, email: "" }
    localStorage.removeItem("token")
    router.push({ name: "Login" })

    return error
  }
}

export { errorHandler }