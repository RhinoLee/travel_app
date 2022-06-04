import router from "@/router/index"
import { useMemberStore } from "@/stores/member"
// import axios from "axios"

const errorHandler = {
  catchError: (error, axiosInstance, router) => {
    return new Promise(async (resolve, reject) => {
      const status = error.response ? error.response.status : null
      const url = error.config.url
      if (url === "/refreshToken") {
        const memberStore = useMemberStore()
        memberStore.logoutHandler()
        router.push({ name: "Login" })
        return reject(error);
      }
      switch (status) {
        case 401:
          {
            try {
              const result = await errorHandler.handle401(error, axiosInstance, router)
              return resolve(result)
            } catch (error) {
              return reject(error)
            }
          }
          break
        default:
          break
      }
      return reject(error);
    })

  },
  suscribeTokenRefresh: (cb) => {
    const memberStore = useMemberStore()
    memberStore.refreshedCall.push(cb)
  },
  onRefreshed: (newToken) => {
    const memberStore = useMemberStore()
    memberStore.refreshedCall.map(cb => cb(newToken))
  },
  handle401: async (error, axios, router) => {
    const memberStore = useMemberStore()
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (config.url === "/refreshToken") {
      memberStore.logoutHandler()
      router.push({ name: "Login" })
      return Promise.reject(error)
    }

    if (config.url === "/verifyMember") {
      return Promise.reject(error)
    }

    // refresh token 流程
    if (!memberStore.isRefreshing) {
      memberStore.isRefreshing = true

      memberStore.refreshTokenHandler()
        .then(res => {
          const newToken = res.data.accessToken

          memberStore.isRefreshing = false
          errorHandler.onRefreshed(newToken)

          memberStore.refreshedCall = []
          memberStore.getMemberInfo()
        })

    }

    const requestSuscribers = new Promise(resolve => {
      errorHandler.suscribeTokenRefresh(newToken => {
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        resolve(axios(originalRequest))
      })
    })

    return requestSuscribers;
  }
}

export { errorHandler }