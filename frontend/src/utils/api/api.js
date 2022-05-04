import axios from "axios"
// import { useCommonStore } from "@/stores/common"

// function addInterceptors(axiosInstance) {
//   // const commonStore = useCommonStore()
//   axiosInstance.interceptors.request.use(function (config) {
//     config.metadata = { startTime: new Date() }
//     // commonStore.isLoading = true
//     return config;
//   }, function (error) {
//     return Promise.reject(error);
//   });

//   axiosInstance.interceptors.response.use(function (response) {
//     response.config.metadata.endTime = new Date()
//     response.responseTime = response.config.metadata.endTime - response.config.metadata.startTime
//     // commonStore.isLoading = false

//     return response;
//   }, function (error) {
//     error.config.metadata.endTime = new Date();
//     error.responseTime = error.config.metadata.endTime - error.config.metadata.startTime;
//     // commonStore.isLoading = false

//     return Promise.reject(error);
//   })

//   return axiosInstance
// }

// google map
const mapRequest = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/"
})
// addInterceptors(mapRequest)

// backend google map
const mapRequest2 = axios.create({
  baseURL: "http://localhost:5003/api/"
})
// addInterceptors(mapRequest2)

// member 
const memberRequest = axios.create({
  baseURL: "http://localhost:5003/api/"
})
// addInterceptors(memberRequest)

// Travel Schedule
const scheduleRequest = axios.create({
  baseURL: "http://localhost:5003/api/"
})
// addInterceptors(scheduleRequest)

// google map 
export const apiGetPlaceId = ({ lat, lng }) => mapRequest.get(`/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLEMAP_APIKEY}`)

// backend google map
export const apiPlaceSearch = (params) => mapRequest2.post("/placeSearch", params, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})
export const apiGetPlaceDetail = (params) => mapRequest2.post("/placeDetail", params, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})

// member
export const apiRegister = (params) => memberRequest.post("/memberRegister", params)
export const apiLogin = (params) => memberRequest.post("/memberLogin", params)
export const apiMemberInfo = () => memberRequest.post("/memberInfo", null, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})

// Travel Schedule
export const apiCreateMainSchedule = (params) => scheduleRequest.post("/mainScheduleCreate", params, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})

export const apiGetAllMainSchedules = () => scheduleRequest.get("/mainSchedules", {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})

export const apiGetMainSchedule = (id) => scheduleRequest.get(`/mainSchedule/${id}`, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
})

export const apiGetSingleSchedule = (id) => scheduleRequest.get(`/mainSchedule/${id}/singleSchedules`, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
})

export const apiCreateSingleSchedule = (params) => scheduleRequest.post("/singleScheduleCreate", params, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})

export const apiUpdateSingleSchedule = (params) => scheduleRequest.patch(`/singleSchedule/${params.id}`, params, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }

})
export const apiDeleteSingleSchedule = (id) => scheduleRequest.delete(`/singleSchedule/${id}`, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})
