import { defineStore } from "pinia"
import { useMemberStore } from "../member"
import { dateHandler } from "@/utils/dateTransform"

export const useTravelStore = defineStore('travel', {
  state: () => {
    return {
      // api params start
      addMainScheduleParams: {
        title: "",
        startDate: "",
        endDate: "",
        picture: null
      },
      editMainScheduleParams: {
        id: "",
        title: "",
        durationDays: "",
        startDateObj: null,
        endDateObj: null,
        startDate: "",
        endDate: "",
        deletePicture: false,
        picture: null,
      },
      addScheDuleParams: {
        title: "",
        date: "",
        start_time: "",
        end_time: "",
        place_id: "",
        place_name: "",
        main_schedule_id: "",
        location: {
          lat: null,
          lng: null
        },
        day_order: ""
      },
      editScheDuleParams: {
        id: "",
        title: "",
        date: "",
        start_time: "",
        end_time: "",
        day_order: ""
      },
      // api params end
      // 既有總旅程計畫列表
      mainScheduleList: [],
      // 總旅程計畫的資訊
      mainScheduleInfo: null,
      // 地點搜尋結果列表
      locationSearchList: [],
      // 總旅程計畫底下的每日行程
      allSchedules: [],
      nowMainScheduleId: null,
      // 目前選到的 schedule Id
      nowScheduleId: null,
      // 單日計畫日期
      nowSelectDate: "",
      // 目前點擊 schedule 的日期
      nowScheduleDate: "",
      // 目前選取到地點的相關資訊
      placeDetail: null,
      // 目前收藏的地點
      placeCollections: [],
      // 導航路線
      directions: {
        routesPolyline: "",
        routesBounds: "",
      },
      // lightbox state
      isEditMainScheduleBoxOpen: false,
      isAddMainScheduleBoxOpen: false,
    }
  },
  getters: {
    // 計算總旅程天數
    durationDays(state) {
      if (!state.addMainScheduleParams.startDate || !state.addMainScheduleParams.endDate) return false
      return dateHandler.calcDurationDays(state.addMainScheduleParams.startDate, state.addMainScheduleParams.endDate)
    },
    // 總計畫日期區間 -> 日期列表
    durationDateList(state) {
      if (!state.mainScheduleInfo) return []
      const list = dateHandler.toDaysList(state.mainScheduleInfo.start_date, state.mainScheduleInfo.end_date)

      return list
    },
    editDurationDateList(state) {
      if (!state.editMainScheduleParams.title) return []
      const list = dateHandler.toDaysList(state.editMainScheduleParams.startDate, state.editMainScheduleParams.endDate)

      return list
    },
    // 被選到的的當日計畫列表（依日期）
    nowDateScheduleList(state) {
      let list = []
      if (state.nowSelectDate) {
        list = state.allSchedules.filter(plan => plan.date === state.nowSelectDate)
      } else {
        list = state.allSchedules
      }
      return list
    },
    // 收藏地點列表（去除跟計劃點位重複的地點）
    placeCollectionsList(state) {
      if (!state.nowDateScheduleList[0]) return []
      const nowSelectScheduleList = state.nowDateScheduleList[0].scheduleList
      if (nowSelectScheduleList.length === 0) return state.placeCollections

      let placeCollections = JSON.parse(JSON.stringify(state.placeCollections))
      nowSelectScheduleList.forEach(item => {
        const removeIdx = placeCollections.findIndex(place => place.place_id === item.place_id)
        if (removeIdx >= 0) placeCollections.splice(removeIdx, 1)
      })

      return placeCollections
    },
    // 被選到的單一計畫資訊
    nowSchedule(state) {
      if (state.allSchedules.length === 0) return null
      let schedule = null
      if (Number.isInteger(state.nowScheduleId) && state.nowScheduleDate) {
        // 先找到該日期
        const scheduleList = state.allSchedules.filter(plan => plan.date === state.nowScheduleDate)[0].scheduleList
        // 在針對該日期底下的每筆 schedule 找到目標
        schedule = scheduleList.filter(schedule => schedule.id === state.nowScheduleId)[0]
      }
      return schedule
    },
    // 被選到的單一計畫資訊 - time 整理成 datepicker 需要格式
    nowScheduleTime(state) {
      if (!this.nowSchedule) return null
      const format = [
        {
          hours: this.nowSchedule.start_time.split(':')[0],
          minutes: this.nowSchedule.start_time.split(':')[1]
        },
        {
          hours: this.nowSchedule.end_time.split(':')[0],
          minutes: this.nowSchedule.end_time.split(':')[1]
        }
      ]

      return format
    },
    memberId() {
      const memberStore = useMemberStore()
      return memberStore.memberInfo.id
    },
    addPlaceCollectionParams(state) {
      if (!state.placeDetail) return null
      return {
        place_id: state.placeDetail.place_id,
        place_name: state.placeDetail.name,
        location: state.placeDetail.location,
      }
    },
    placeInfoComputed(state) {
      if (!state.placeDetail || !state.placeDetail.place_id) return state.placeDetail
      // 比對收藏列表，新增 isCollect, collectId 欄位
      const placeDetail = JSON.parse(JSON.stringify(state.placeDetail))
      const index = state.placeCollections.findIndex(place => place.place_id === placeDetail.place_id)
      placeDetail.isCollect = index >= 0
      placeDetail.collectId = index >= 0 ? state.placeCollections[index].id : null

      return placeDetail
    }
  },
  actions: {
    // 選取 schedule
    selectSchedule(scheduleId, date) {
      this.nowScheduleId = scheduleId
      this.nowScheduleDate = date
    },
    // 取消選取 schedule
    cancelSelectSchedule() {
      this.nowScheduleId = null
      this.nowScheduleDate = ""
    },
    clearAddMainScheduleParams() {
      this.addMainScheduleParams.title = ""
      this.addMainScheduleParams.startDate = ""
      this.addMainScheduleParams.endDate = ""
      this.addMainScheduleParams.picture = null
    },
    // 設定編輯單一行程參數
    setEditScheduleParams() {
      if (!this.nowSchedule) return
      const editScheDuleParams = JSON.parse(JSON.stringify(this.nowSchedule))
      this.editScheDuleParams = editScheDuleParams
    },
    // 設定編輯總行程參數
    setEditMainScheduleParams() {
      console.log("setEditMainScheduleParams");
      if (!this.nowMainScheduleId) return
      const info = this.mainScheduleList.filter(schedule => schedule.id === this.nowMainScheduleId)[0]

      // 設定 default params
      this.editMainScheduleParams.id = info.id
      this.editMainScheduleParams.title = info.title
      this.editMainScheduleParams.durationDays = info.durationDays
      this.editMainScheduleParams.startDateObj = info.startDateObj
      this.editMainScheduleParams.endDateObj = info.endDateObj
      this.editMainScheduleParams.startDate = info.utcStartDate
      this.editMainScheduleParams.endDate = info.utcEndDate
      this.editMainScheduleParams.deletePicture = false
      this.editMainScheduleParams.picture = null
    },
    // 單一行程拖拉排序
    exchangeSchedule({ element, oldIndex, newIndex }) {
      const list = this.allSchedules.filter(schedule => schedule.date === element.date)[0].scheduleList

      if (newIndex === list.length - 1) {
        element.start_time = list[newIndex - 1].end_time
        element.end_time = dateHandler.calcPlusTime(element.start_time, 60)

        return true
      }

      if (newIndex === 0) {
        list.forEach((schedule, idx) => {
          if (idx === 0) {
            element.start_time = list[1].start_time
            element.end_time = list[1].end_time
          }
          if (idx > 0) {
            schedule.start_time = list[idx - 1].end_time
            schedule.end_time = dateHandler.calcPlusTime(schedule.start_time, 60)
          }
        })

        return true
      }

      list.forEach((schedule, idx) => {
        if (idx === newIndex) {
          element.start_time = list[idx - 1].end_time
          element.end_time = dateHandler.calcPlusTime(element.start_time, 60)
        }
        if (idx > newIndex) {
          schedule.start_time = list[newIndex].end_time
          schedule.end_time = dateHandler.calcPlusTime(element.end_time, 60)
        }
      })

      return true

    },
    async getLocationInfo(placeId) {
      const params = {
        place_id: placeId
      }

      try {
        const placeDetailRes = await this.$axios.api.apiGetPlaceDetail(params)

        if (placeDetailRes && placeDetailRes.data.success) {
          this.placeDetail = placeDetailRes.data.results
        } else {
          this.placeDetail = {}
        }
      } catch (err) {
        this.placeDetail = {}
        return false
      }

    },
    async placeSearch(searchTxt) {
      try {
        const params = {
          input: searchTxt,
          fields: "formatted_address,name,rating,geometry,place_id"
        }
        const searchResult = await this.$axios.api.apiPlaceSearch(params)
        if (searchResult.data.success) {
          return this.locationSearchList = searchResult.data.results
        }

        this.locationSearchList = []
      } catch (error) {
        this.locationSearchList = []
        return false
      }
    },
    // Schedule API
    async addMainSchedule() {
      if (!this.addMainScheduleParams.title) return

      try {
        const formData = new FormData()
        if (this.addMainScheduleParams.picture) {
          formData.append("picture", this.addMainScheduleParams.picture)
        }
        formData.append("title", this.addMainScheduleParams.title)
        formData.append("startDate", this.addMainScheduleParams.startDate)
        formData.append("endDate", this.addMainScheduleParams.endDate)

        console.log("why??");
        const result = await this.$axios.api.apiCreateMainSchedule(formData)
        if (result && result.data.success) this.getMainScheduleList()

      } catch (error) {
        console.log("error", error);
        return false
      }
    },
    async getMainScheduleList() {
      try {
        const result = await this.$axios.api.apiGetAllMainSchedules()
        if (result && result.data.success) {
          const { mainScheduleList } = result.data.results

          mainScheduleList.forEach(schedule => {
            // 處理 UTC 日期
            schedule.startDateObj = dateHandler.dateFormatDate(schedule.start_date)
            schedule.endDateObj = dateHandler.dateFormatDate(schedule.end_date)
            schedule.startDate = dateHandler.localFormatString(schedule.start_date)
            schedule.endDate = dateHandler.localFormatString(schedule.end_date)
            schedule.utcStartDate = schedule.start_date
            schedule.utcEndDate = schedule.end_date
            schedule.durationDays = dateHandler.calcDurationDays(schedule.start_date, schedule.end_date)
          })


          return this.mainScheduleList = result.data.results.mainScheduleList
        }

        this.mainScheduleList = []
      } catch (error) {
        return false
      }
    },
    async getMainSchedule() {
      try {
        const result = await this.$axios.api.apiGetMainSchedule(this.nowMainScheduleId)
        if (!result || !result.data.success) return

        const allSchedules = result.data.results.allSchedules

        allSchedules.forEach(schedule => {
          // 跟收藏列表比對，新增 isCollect 欄位
          // const index = this.placeCollections.findIndex(place => place.place_id === schedule.place_id)
          // schedule.isCollect = index >= 0

          // 新增星期欄位
          schedule.day = dateHandler.getDayOfWeek(schedule.date)
        })

        this.allSchedules = allSchedules
        this.mainScheduleInfo = result.data.results.mainscheduleInfo
        this.nowSelectDate = allSchedules[0].date // 預設選擇第一天日期
      } catch (error) {
        return false
      }
    },
    async updateMainSchedule() {
      if (!this.editMainScheduleParams.title) return
      let editMainSchduleResult = null

      try {
        const formData = new FormData()
        const mainScheduleId = this.editMainScheduleParams.id
        console.log("this.editMainScheduleParams.picture", this.editMainScheduleParams.picture);
        if (this.editMainScheduleParams.picture) {
          formData.append("picture", this.editMainScheduleParams.picture)
        }
        formData.append("title", this.editMainScheduleParams.title)
        formData.append("startDate", this.editMainScheduleParams.startDate)
        formData.append("endDate", this.editMainScheduleParams.endDate)
        formData.append("deletePicture", this.editMainScheduleParams.deletePicture)

        // 更新主表單
        editMainSchduleResult = await this.$axios.api.apiUpdateMainSchedule(mainScheduleId, formData)

      } catch (error) {
        return false
      }

      // 判斷日期區間是否有更改，無更改不需更新子行程日期
      if (this.mainScheduleInfo.start_date !== this.editMainScheduleParams.startDate ||
        this.mainScheduleInfo.end_date !== this.editMainScheduleParams.endDate) {

        try {
          const updateDateResult = await this.$axios.api.apiUpdateSingleScheduleDate({
            dates: this.editDurationDateList,
            main_schedule_id: mainScheduleId
          })
        } catch (error) {
          return false
        }
      }

      // 主表單更新成功，更新目前資料
      if (editMainSchduleResult && editMainSchduleResult.data.success) {
        this.getMainSchedule()
        this.getMainScheduleList()
      }

    },
    async addSingleSchedule() {
      try {
        const result = await this.$axios.api.apiCreateSingleSchedule(this.addScheDuleParams)
        this.locationSearchList = []

        return result.data.success
      } catch (error) {
        return false
      }
    },
    async getSingleSchedule() {
      try {
        const result = await this.$axios.api.apiGetSingleSchedule(this.nowMainScheduleId)
        if (!result || !result.data.success) return

        const sheduleList = result.data.results.mainScheduleList

        sheduleList.forEach(schedule => {
          // 跟收藏列表比對，新增 isCollect 欄位
          // const index = this.placeCollections.findIndex(place => place.place_id === schedule.place_id)
          // schedule.isCollect = index >= 0

          // 新增星期欄位
          schedule.day = dateHandler.getDayOfWeek(schedule.date)
        })

        this.allSchedules = sheduleList
        this.mainScheduleInfo = result.data.results.mainscheduleInfo
        this.nowSelectDate = sheduleList[0].date // 預設選擇第一天日期
      } catch (error) {
        return false
      }

    },
    async updateSingleSchedule() {
      try {
        const result = await this.$axios.api.apiUpdateSingleSchedule(this.editScheDuleParams)
        if (result && result.data.success) {
          const getResult = await this.getMainSchedule()
          return true
        }
      } catch (error) {
        return false
      }
    },
    async updateSingleScheduleGroup(date) {
      const list = this.allSchedules.filter(schedule => schedule.date === date)[0].scheduleList
      const promiseArr = []

      list.forEach(schedule => {
        const { id, title, date, start_time, end_time } = schedule
        const params = { id, title, date, start_time, end_time }
        promiseArr.push(this.$axios.api.apiUpdateSingleSchedule(params))
      })

      try {
        const result = await Promise.all(promiseArr)
        if (result) {
          const getResult = await this.getMainSchedule()
          return true
        }
      } catch (error) {
        return false
      }
    },
    async deleteSingleSchedule() {
      try {
        const result = await this.$axios.api.apiDeleteSingleSchedule(this.nowScheduleId)
        if (result && result.data.success) {
          const getResult = await this.getMainSchedule()
          return true
        }
      } catch (error) {
        return false
      }
    },
    // 路徑 API
    async getDirections() {
      if (!this.nowDateScheduleList[0]) return
      const { scheduleList } = this.nowDateScheduleList[0]
      const origin = scheduleList[0].place_id
      const destination = scheduleList[scheduleList.length - 1].place_id
      const waypoints = []
      if (scheduleList.length > 1) {
        scheduleList.forEach((schedule, idx) => {
          if (idx > 0 && idx < scheduleList.length - 1) {
            waypoints.push(schedule.place_id)
          }
        })
      }

      try {
        const result = await this.$axios.api.apiGetDirections({ origin, destination, waypoints })
        if (result.data.success) {
          this.directions.routesPolyline = result.data.results.routes[0].overview_polyline.points
          this.directions.routesBounds = result.data.results.routes[0].bounds
        } else {
          this.directions.routesPolyline = ""
        }

        return result && result.data.success
      } catch (error) {
        this.directions.routesPolyline = ""
        return false
      }
    },
    // 收藏地點 API
    async addPlaceCollection() {
      try {
        const result = await this.$axios.api.apiAddPlaceCollection(this.addPlaceCollectionParams)
        this.getPlaceCollections()
        return result.data.success
      } catch (error) {
        return false
      }
    },
    async getPlaceCollections() {
      try {
        const result = await this.$axios.api.apiGetPlaceCollections()
        if (result.data.success) {
          this.placeCollections = result.data.results.placeCollections
        }
        return result.data.success
      } catch (error) {
        return false
      }
    },
    async removePlaceCollection(collectId) {
      try {
        const result = await this.$axios.api.apiDeleteCollections(collectId)
        if (result.data.success) {
          this.getPlaceCollections()
        }
        return result.data.success
      } catch (error) {
        return false
      }
    }
  }

})