import { defineStore } from "pinia"
import { useMemberStore } from "../member"
import { dateHandler } from "@/utils/dateTransform"

export const useTravelStore = defineStore('travel', {
  state: () => {
    return {
      // 主行程 新增 / 編輯 Params
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
      // 子行程 新增 / 編輯 Params
      addScheDuleParams: {
        title: "",
        date: "",
        start_time: "00:00",
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
        durations: [],
        distances: []
      },
      universalUrl: "",
      // lightbox state
      isEditMainScheduleBoxOpen: false,
      isAddMainScheduleBoxOpen: false,
      isDeleteMainScheduleBoxOpen: false,
      isAddScheduleBoxOpen: false,
      isEditScheduleBoxOpen: false,
      isDeleteScheduleBoxOpen: false,
      // actionbox - mainSchedule id 有對上就開啟（null = 全關）
      isActionBoxOpenId: null,
      // schedule sidebar
      isMenuOpen: false
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
    nowScheduleStartTime(state) {
      if (!this.nowSchedule) return null
      const format = {
        hours: this.nowSchedule.start_time.split(':')[0],
        minutes: this.nowSchedule.start_time.split(':')[1]
      }
      return format
    },
    // nowScheduleTimeRange(state) {
    //   if (!this.nowSchedule) return null
    //   const format = [
    //     {
    //       hours: this.nowSchedule.start_time.split(':')[0],
    //       minutes: this.nowSchedule.start_time.split(':')[1]
    //     },
    //     {
    //       hours: this.nowSchedule.end_time.split(':')[0],
    //       minutes: this.nowSchedule.end_time.split(':')[1]
    //     }
    //   ]

    //   return format
    // },
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
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
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
    clearEditScheduleParams() {
      this.editScheDuleParams.id = ""
      this.editScheDuleParams.title = ""
      this.editScheDuleParams.date = ""
      this.editScheDuleParams.start_time = ""
      this.editScheDuleParams.day_order = ""
    },
    clearDirections() {
      this.directions.routesPolyline = ""
      this.directions.routesBounds = ""
      this.directions.durations = []
      this.directions.distances = []
    },
    closeAllScheduleBox() {
      this.isAddScheduleBoxOpen = false
      this.isEditScheduleBoxOpen = false
      this.isDeleteScheduleBoxOpen = false
    },
    unMountMainSchedulePage() {
      // 關閉所有 lightbox
      this.closeAllScheduleBox()
      // clear data
      this.clearDirections()
      this.allSchedules = []
      this.nowMainScheduleId = null
      this.nowScheduleId = null
      this.locationSearchList = []
      this.placeDetail = null
      this.nowSelectDate = ""
    },
    // 設定編輯單一行程參數
    setEditScheduleParams() {
      if (!this.nowSchedule) return
      this.editScheDuleParams.id = this.nowSchedule.id
      this.editScheDuleParams.title = this.nowSchedule.title
      this.editScheDuleParams.date = this.nowSchedule.date
      this.editScheDuleParams.start_time = this.nowSchedule.start_time
      this.editScheDuleParams.day_order = this.nowSchedule.day_order
      this.editScheDuleParams.place_name = this.nowSchedule.place_name
    },
    // 設定編輯總行程參數
    setEditMainScheduleParams() {
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
      // element =  拖拉項目
      // oldIndex =  拖拉項目原本位置
      // newIndex =  拖拉項目更新後位置

      const list = this.allSchedules.filter(schedule => schedule.date === element.date)[0].scheduleList

      // 如果 oldIndex & newIndex 只差 1 -> 直接對調，不跑迴圈
      if (Math.abs(newIndex - oldIndex) === 1) {
        const start_time = list[oldIndex].start_time
        list[oldIndex].start_time = element.start_time
        element.start_time = start_time

        this.updateSingleScheduleGroup(element.date)
        return
      }

      // 往下拖
      if (newIndex - oldIndex > 0) {
        const start_time = element.start_time
        for(let i = newIndex; i > oldIndex; i--) {
          list[i].start_time = list[i - 1].start_time
        }
        list[oldIndex].start_time = start_time

        this.updateSingleScheduleGroup(element.date)
        return
      }

      // 往上拖
      if (newIndex - oldIndex < 0) {
        const start_time = element.start_time
        for(let i = newIndex; i < oldIndex; i++) {
          list[i].start_time = list[i + 1].start_time
        }
        list[oldIndex].start_time = start_time

        this.updateSingleScheduleGroup(element.date)
        return
      }
    },
    closeAction() {
      this.isActionBoxOpenId = null
    },
    calcSchedulesEndTime() {
      const daySchedule = this.allSchedules.find(daySchedule => daySchedule.date === this.nowSelectDate)
      // EX: 4 個行程，3 個路程時間

      if (this.directions.durations.length !== daySchedule.scheduleList.length - 1) return

      this.directions.durations.forEach((duration, idx) => {
        let nextStopStart = daySchedule.scheduleList[idx + 1].start_time
        let end_time = dateHandler.calcMinusTime(nextStopStart, duration.value / 60)
        daySchedule.scheduleList[idx].end_time = end_time
      })
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

        const result = await this.$axios.api.apiCreateMainSchedule(formData)
        if (result && result.data.success) this.getMainScheduleList()

      } catch (error) {
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
        await this.getDirections()
        // this.nowSelectDate = allSchedules[0].date // 預設選擇第一天日期
        return true
      } catch (error) {
        return false
      }
    },
    async updateMainSchedule() {
      if (!this.editMainScheduleParams.title) return
      const mainScheduleId = this.editMainScheduleParams.id
      let editMainSchduleResult = null

      try {
        const formData = new FormData()
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
    async deleteMainSchedule() {
      try {
        const result = await this.$axios.api.apiDeleteMainSchedule(this.nowMainScheduleId)
        if (result && result.data.success) {
          this.getMainScheduleList()
          return true
        }
      } catch (error) {
        return false
      }
    },
    async addSingleSchedule() {
      try {
        const result = await this.$axios.api.apiCreateSingleSchedule(this.addScheDuleParams)
        await this.getMainSchedule()
        await this.getDirections()
        this.locationSearchList = []
        return result.data.success
      } catch (error) {
        return false
      }
    },
    async updateSingleSchedule() {
      try {
        const result = await this.$axios.api.apiUpdateSingleSchedule(this.editScheDuleParams)
        if (result && result.data.success) {
          const getResult = await this.getMainSchedule()
          await this.getDirections()
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
        const { id, title, date, start_time, day_order } = schedule
        const params = { id, title, date, start_time, day_order }
        promiseArr.push(this.$axios.api.apiUpdateSingleSchedule(params))
      })

      try {
        const result = await Promise.all(promiseArr)
        if (result) {
          const getResult = await this.getMainSchedule()
          await this.getDirections()
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
          await this.getDirections()
          return true
        }
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
    // Map
    // 路徑 API
    async getDirections() {
      // this.clearDirections()
      if (!this.nowDateScheduleList[0] || this.nowDateScheduleList[0].scheduleList.length === 1) return
      const { scheduleList } = this.nowDateScheduleList[0]
      // 起點行程
      const origin = scheduleList[0].place_id
      const originName = scheduleList[0].place_name
      // 終點行程
      const destination = scheduleList[scheduleList.length - 1].place_id
      const destinationName = scheduleList[scheduleList.length - 1].place_name
      // waypoints = 中繼站
      const waypoints = []
      const waypointsNames = []
      if (scheduleList.length > 1) {
        scheduleList.forEach((schedule, idx) => {
          if (idx > 0 && idx < scheduleList.length - 1) {
            waypoints.push(schedule.place_id)
            waypointsNames.push(schedule.place_name)
          }
        })
      }

      try {
        const result = await this.$axios.api.apiGetDirections({ origin, destination, waypoints })
        if (result.data.success) {
          this.directions.routesPolyline = result.data.results.routes[0].overview_polyline.points
          this.directions.routesBounds = result.data.results.routes[0].bounds

          // 整理各地點間的交通時間 & 距離
          const legs = result.data.results.routes[0].legs || null
          this.directions.durations = []
          this.directions.distances = []
          if (legs) {
            legs.forEach(leg => {
              this.directions.durations.push(leg.duration)
              this.directions.distances.push(leg.distance)
            })

            this.calcSchedulesEndTime()
          }

          // 組合連結
          this.universalUrlHandler({ origin, originName, destination, destinationName, waypoints, waypointsNames })

        } else {
          this.clearDirections()

          // 清空連結
          this.universalUrl = ""
        }

        return result && result.data.success
      } catch (error) {
        this.clearDirections()
        return false
      }
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
          query: searchTxt,
          language: "zh-TW",
          region: "tw"
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
    universalUrlHandler({ origin, originName, destination, destinationName, waypoints, waypointsNames }) {

      let waypointStr = waypoints.join("|")
      let waypointsNameStr = waypointsNames.join("|")

      const url = `https://www.google.com/maps/dir/?api=1&origin=${originName}&origin_place_id=${origin}&destination=${destinationName}&destination_place_id=${destination}&waypoints=${waypointsNameStr}&waypoint_place_ids=${waypointStr}`

      const encoded = encodeURI(url);
      // console.log("url", url);
      // console.log("encoded", encoded);
      this.universalUrl = encoded
    },
  }

})