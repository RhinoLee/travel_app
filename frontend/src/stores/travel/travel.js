import { defineStore } from "pinia"
import { useMemberStore } from "../member"
import { dateHandler } from "@/utils/dateTransform"

export const useTravelStore = defineStore('travel', {
  state: () => {
    return {
      addMainScheduleParams: {
        title: "",
        startDate: "",
        endDate: "",
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
        }
      },
      editScheDuleParams: {
        id: "",
        title: "",
        date: "",
        start_time: "",
        end_time: "",
      },
      nowMainScheduleId: null,
      // 既有總旅程計畫列表
      mainScheduleList: [
        {
          id: 1,
          pic: "https://picsum.photos/480/260?random=1",
          title: "花東五天四夜",
          startDate: "2022-01-01",
          endDate: "2022-01-05",
          intro: "內容內容內容內容內容內容內容內容內容內容內容內容內容內容",
        },
        {
          id: 2,
          pic: "https://picsum.photos/480/260?random=2",
          title: "環島八天七夜",
          startDate: "2022-02-01",
          endDate: "2022-02-08",
          intro: "內容內容內容內容內容內容內容內容內容內容內容內容內容內容",
        },
        {
          id: 3,
          pic: "https://picsum.photos/480/260?random=3",
          title: "台南一日遊",
          startDate: "2022-03-01",
          endDate: "2022-03-01",
          intro: "內容內容內容內容內容內容內容內容內容內容內容內容內容內容",
        },
      ],
      // 總旅程計畫的資訊
      mainScheduleInfo: {
        id: 1,
        pic: "https://picsum.photos/480/260?random=1",
        title: "花東五天四夜",
        startDate: "2022-01-01",
        endDate: "2022-01-05",
        intro: "內容內容內容內容內容內容內容內容內容內容內容內容內容內容",
      },
      // 地點搜尋結果列表
      locationSearchList: [],
      // 總旅程計畫底下的每日行程
      singleScheduleList: [],
      nowSingleScheduleId: null,
      // 單日計畫日期
      nowSelectDate: "",
      // 目前點擊 schedule 的日期
      nowSingleScheduleDate: "",
      // 目前選取到地點的相關資訊
      placeDetail: null,
      // 目前收藏的地點
      placeCollections: [],
      // 導航路線
      directions: {
        routesPolyline: "",
        routesBounds: "",
      },
      // routesPolyline: ""
    }
  },
  getters: {
    dutationDays(state) {
      if (!state.addMainScheduleParams.startDate || !state.addMainScheduleParams.endDate) return false
      return dateHandler.calcDurationDays(state.addMainScheduleParams.startDate, state.addMainScheduleParams.endDate)
    },
    // 該計畫底下的日期選擇列表
    singleScheduleSelectList(state) {
      const list = []
      if (state.singleScheduleList) {
        state.singleScheduleList.forEach(schedule => {
          const date = schedule.date
          const day = dateHandler.getDayOfWeek(date)
          const obj = {
            date,
            day
          }

          list.push(obj)
        })
      }

      return list
    },
    // 被選到的的當日計畫列表（依日期）
    nowSelectSchedule(state) {
      let list;
      if (state.nowSelectDate) {
        list = state.singleScheduleList.filter(plan => plan.date === state.nowSelectDate)
      } else {
        list = state.singleScheduleList
      }
      return list
    },
    // 收藏地點列表（去除跟計劃點位重複的地點）
    placeCollectionsList(state) {
      if (!state.nowSelectSchedule[0]) return []
      const nowSelectScheduleList = state.nowSelectSchedule[0].scheduleList
      if (nowSelectScheduleList.length === 0) return state.placeCollections

      let placeCollections = JSON.parse(JSON.stringify(state.placeCollections))
      nowSelectScheduleList.forEach(item => {
        const removeIdx = placeCollections.findIndex(place => place.place_id === item.place_id)
        if (removeIdx >= 0) placeCollections.splice(removeIdx, 1)
      })

      return placeCollections
    },
    // 被選到的單一計畫資訊
    nowSelectSingleSchedule(state) {
      let scheduleInfo = null
      if (Number.isInteger(state.nowSingleScheduleId) && state.nowSingleScheduleDate) {
        const scheduleList = state.singleScheduleList.filter(plan => plan.date === state.nowSingleScheduleDate)[0].scheduleList
        scheduleInfo = scheduleList.filter(schedule => schedule.id === state.nowSingleScheduleId)[0]
      }
      return scheduleInfo
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
    setEditScheduleParams() {
      if (!this.nowSelectSingleSchedule) return
      const editScheDuleParams = JSON.parse(JSON.stringify(this.nowSelectSingleSchedule))
      this.editScheDuleParams = editScheDuleParams
    },
    exchangeSchedule({ element, oldIndex, newIndex }) {
      const list = this.singleScheduleList.filter(schedule => schedule.date === element.date)[0].scheduleList

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
      try {
        const params = {
          memberId: this.memberId,
          title: this.addMainScheduleParams.title,
          startDate: this.addMainScheduleParams.startDate,
          endDate: this.addMainScheduleParams.endDate,
        }

        const result = await this.$axios.api.apiCreateMainSchedule(params)

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
            schedule.start_date = dateHandler.localFormat(schedule.start_date)
            schedule.end_date = dateHandler.localFormat(schedule.end_date)
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
        if (result && result.data.success) {
          const { mainscheduleInfo } = result.data.results
          // 計算總天數
          mainscheduleInfo.daysList = dateHandler.toDaysList(mainscheduleInfo.start_date, mainscheduleInfo.end_date)

          this.mainScheduleInfo = mainscheduleInfo

          const singeScheduleResult = await this.getSingleSchedule()

          return true
        }

        this.mainScheduleInfo = {}
        return false
      } catch (error) {
        return false
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
        if (!Array.isArray(sheduleList) || sheduleList.length === 0) return

        const mainList = []
        const obj = {}
        sheduleList.forEach(shedule => {
          // 跟收藏列表比對，新增 isCollect 欄位
          const index = this.placeCollections.findIndex(place => place.place_id === shedule.place_id)
          shedule.isCollect = index >= 0

          // 做成列表所需格式
          if (!obj[shedule.date]) {
            obj[shedule.date] = {}

            let obj2 = {}
            obj2.date = shedule.date
            obj2.day = dateHandler.getDayOfWeek(shedule.date)
            obj2.scheduleList = []
            mainList.push(obj2)
          }

          mainList.forEach(item => {
            if (item.date === shedule.date) {
              item.scheduleList.push(shedule)
            }
          })
        })

        this.singleScheduleList = mainList
        this.nowSelectDate = mainList[0].date // 預設選擇第一天日期
      } catch (error) {
        return false
      }

    },
    async updateSingleSchedule() {
      try {
        const result = await this.$axios.api.apiUpdateSingleSchedule(this.editScheDuleParams)
        if (result && result.data.success) {
          const getResult = await this.getSingleSchedule()
          return true
        }
      } catch (error) {
        return false
      }
    },
    async updateSingleScheduleGroup(date) {
      const list = this.singleScheduleList.filter(schedule => schedule.date === date)[0].scheduleList
      const promiseArr = []

      list.forEach(schedule => {
        const { id, title, date, start_time, end_time } = schedule
        const params = { id, title, date, start_time, end_time }
        promiseArr.push(this.$axios.api.apiUpdateSingleSchedule(params))
      })

      try {
        const result = await Promise.all(promiseArr)
        if (result) {
          const getResult = await this.getSingleSchedule()
          return true
        }
      } catch (error) {
        return false
      }
    },
    async deleteSingleSchedule() {
      try {
        const result = await this.$axios.api.apiDeleteSingleSchedule(this.nowSingleScheduleId)
        if (result && result.data.success) {
          const getResult = await this.getSingleSchedule()
          return true
        }
      } catch (error) {
        return false
      }
    },
    // 路徑 API
    async getDirections() {
      const { scheduleList } = this.nowSelectSchedule[0]
      const origin = scheduleList[0].place_id
      const destination = scheduleList[scheduleList.length - 1].place_id
      const waypoints = []
      if (scheduleList.length > 2) {
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