import { useCommonStore } from "@/stores/common"
import axios from "axios"
export default {
  install(app, pinia) {
    const commonStore = useCommonStore()

    const $axios = {
      addInterceptors: (axiosInstance) => {
        axiosInstance.interceptors.request.use(function (config) {
          config.metadata = { startTime: new Date() }
          commonStore.isLoading = true
          return config;
        }, function (error) {
          return Promise.reject(error);
        });

        axiosInstance.interceptors.response.use(function (response) {
          response.config.metadata.endTime = new Date()
          response.responseTime = response.config.metadata.endTime - response.config.metadata.startTime
          commonStore.isLoading = false

          return response;
        }, function (error) {
          error.config.metadata.endTime = new Date();
          error.responseTime = error.config.metadata.endTime - error.config.metadata.startTime;
          commonStore.isLoading = false

          return Promise.reject(error);
        })

        return axiosInstance
      },
      instances: {
        mapRequest: () => {
          const axiosInstance = axios.create({
            baseURL: "https://maps.googleapis.com/maps/api/"
          })

          addInterceptors(axiosInstance)
          return axiosInstance
        },
        mapRequest2: () => {
          const axiosInstance = axios.create({
            baseURL: "http://localhost:5003/api/"
          })

          $axios.addInterceptors(axiosInstance)
          return axiosInstance
        },
        memberRequest: () => {
          const axiosInstance = axios.create({
            baseURL: "http://localhost:5003/api/"
          })

          $axios.addInterceptors(axiosInstance)
          return axiosInstance
        },
        scheduleRequest: () => {
          const axiosInstance = axios.create({ baseURL: "http://localhost:5003/api/" })
          $axios.addInterceptors(axiosInstance)
          return axiosInstance
        }
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
          return instance.post("/memberRegister", params)
        },
        apiLogin: (params) => {
          const instance = $axios.instances.memberRequest()
          return instance.post("/memberLogin", params)
        },
        apiMemberInfo: () => {
          const instance = $axios.instances.memberRequest
          return instance.post("/memberInfo", null, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          })
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
          return instance.patch(`/singleSchedule/${params.id}`, params, {
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
      }
    }

    function axiosHandler() {
      return { $axios }
    }

    // app.config.globalProperties.$axios = $axios
    pinia.use(axiosHandler)
  },
}