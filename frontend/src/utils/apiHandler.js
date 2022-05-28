import { useCommonStore } from "@/stores/common"
import { useMemberStore } from "@/stores/member"
import { errorHandler } from "@/utils/errorHandler"
import axios from "axios"
export default {
  install(app, { pinia, router }) {
    const commonStore = useCommonStore()

    const $axios = {
      addLoadingInterceptor: (axiosInstance) => {
        axiosInstance.interceptors.request.use(config => {
          config.metadata = { startTime: new Date() }
          commonStore.isLoading = true
          return config;
        }, error => {
          return Promise.reject(error);
        });

        axiosInstance.interceptors.response.use(response => {
          response.config.metadata.endTime = new Date()
          response.responseTime = response.config.metadata.endTime - response.config.metadata.startTime
          commonStore.isLoading = false

          return response;
        }, error => {
          error.config.metadata.endTime = new Date();
          error.responseTime = error.config.metadata.endTime - error.config.metadata.startTime;
          commonStore.isLoading = false

          return Promise.reject(error);
        })

        return axiosInstance
      },
      addErrorInterceptor: (axiosInstance) => {
        axiosInstance.interceptors.response.use(response => response, async (error) => {
          return errorHandler.catchError(error, axiosInstance, router)
            .then((res) => {
              return Promise.resolve(res)
            })
            .catch(err => {
              return Promise.reject(err)
            })
        })

        return axiosInstance
      },
      instances: {
        mapRequest: () => {
          const axiosInstance = axios.create({
            baseURL: "https://maps.googleapis.com/maps/api/"
          })

          $axios.addLoadingInterceptor(axiosInstance)
          $axios.addErrorInterceptor(axiosInstance)
          return axiosInstance
        },
        mapRequest2: () => {
          const axiosInstance = axios.create({
            baseURL: `${import.meta.env.VITE_API_DOMAINN}/api/`
          })

          $axios.addLoadingInterceptor(axiosInstance)
          $axios.addErrorInterceptor(axiosInstance)
          return axiosInstance
        },
        memberRequest: () => {
          const axiosInstance = axios.create({
            baseURL: `${import.meta.env.VITE_API_DOMAINN}/api/member`
          })

          $axios.addLoadingInterceptor(axiosInstance)
          $axios.addErrorInterceptor(axiosInstance)
          return axiosInstance
        },
        scheduleRequest: () => {
          const axiosInstance = axios.create({ baseURL: `${import.meta.env.VITE_API_DOMAINN}/api/` })
          $axios.addLoadingInterceptor(axiosInstance)
          $axios.addErrorInterceptor(axiosInstance)
          return axiosInstance
        },
        placeCollectionRequest: () => {
          const axiosInstance = axios.create({ baseURL: `${import.meta.env.VITE_API_DOMAINN}/api/placeCollection` })
          $axios.addLoadingInterceptor(axiosInstance)
          $axios.addErrorInterceptor(axiosInstance)
          return axiosInstance
        },
      },
      api: {
        apiGetPlaceId: ({ lat, lng }) => {
          const instance = $axios.instances.mapRequest()
          return instance.get(`/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLEMAP_APIKEY}`)
        },
        apiPlaceSearch: (params) => {
          const instance = $axios.instances.mapRequest2()
          return instance.post("/placeSearch", params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiGetPlaceDetail: (params) => {
          const instance = $axios.instances.mapRequest2()
          return instance.post("/placeDetail", params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiGetDirections: (params) => {
          const instance = $axios.instances.mapRequest2()
          return instance.post(`/getDirections`, params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiRegister: (params) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/register", params)
        },
        apiLogin: (params) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/login", params)
        },
        apiVerifyMember: (token) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/verifyMember", null, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
        },
        apiVerifyEmail: (params) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/verifyEmail", params)
        },
        apiResetPasswordEmail: (params) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/resetPasswordEmail", params)
        },
        apiResetPassword: (token, params) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/resetPassword", params, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
        },
        apiMemberInfo: () => {
          const instance = $axios.instances.memberRequest()
          return instance.get("/memberInfo", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiUpdateAvatar: (params) => {
          const instance = $axios.instances.memberRequest()
          return instance.put("/avatar", params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          })
        },
        apiRefreshToken: (refreshToken) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/refreshToken", { refreshToken })
        },
        apiCreateMainSchedule: (params) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.post("/mainScheduleCreate", params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiGetAllMainSchedules: () => {
          const instance = $axios.instances.scheduleRequest()
          return instance.get("/mainSchedules", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiGetMainSchedule: (id) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.get(`/mainSchedule/${id}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
          })
        },
        apiUpdateMainSchedule: (id, params) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.put(`/mainScheduleUpdate/${id}`, params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            },
          })
        },
        apiGetSingleSchedule: (id) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.get(`/mainSchedule/${id}/singleSchedules`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
          })
        },
        apiCreateSingleSchedule: (params) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.post("/singleScheduleCreate", params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiUpdateSingleSchedule: (params) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.put(`/singleSchedule/${params.id}`, params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }

          })
        },
        apiUpdateSingleScheduleDate: (params) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.put(`/singleSchedule_date`, params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }

          })
        },
        apiDeleteSingleSchedule: (id) => {
          const instance = $axios.instances.scheduleRequest()
          return instance.delete(`/singleSchedule/${id}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiAddPlaceCollection: (params) => {
          const instance = $axios.instances.placeCollectionRequest()
          return instance.post("", params, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiGetPlaceCollections: () => {
          const instance = $axios.instances.placeCollectionRequest()
          return instance.get("", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
        apiDeleteCollections: (collectId) => {
          const instance = $axios.instances.placeCollectionRequest()
          return instance.delete(`/${collectId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
        },
      }
    }

    function axiosHandler() {
      return { $axios }
    }

    pinia.use(axiosHandler)
  },
}