import { defineStore } from "pinia"
// import { $axios } from '@/main'
import { useMemberStore } from "../member"
import { apiGetPlaceId, apiGetPlaceDetail, apiPlaceSearch, apiCreateMainSchedule, apiGetMainSchedule, apiGetAllMainSchedules, apiCreateSingleSchedule, apiGetSingleSchedule, apiUpdateSingleSchedule, apiDeleteSingleSchedule } from "@/utils/api/api"
import { dateHandler } from "@/utils/dateTransform"
import { errorHandler } from "../../utils/api/errorHandler"

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
      // 導航路線
      directions: {
        routesPolyline: "",
        routesBounds: "",
      },
      routesPolyline: ""
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
          // const day = dateHandler.getDayOfWeek(date)
          const obj = {
            date,
            // day
          }

          list.push(obj)
        })
      }

      return list
    },
    // 總旅程裡的當日計畫列表
    nowSelectSchedule(state) {
      let list;
      if (state.nowSelectDate) {
        list = state.singleScheduleList.filter(plan => plan.date === state.nowSelectDate)
      } else {
        list = state.singleScheduleList
      }
      return list
    },
    // 總旅程裡的當日計畫列表裡的特定計畫
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
        Promise.reject(err)
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
        Promise.reject(err)
      }
    },
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
        Promise.reject(err)
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
        Promise.reject(err)
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
        Promise.reject(err)
        return true
      }
    },
    async addSingleSchedule() {
      try {
        const result = await this.$axios.api.apiCreateSingleSchedule(this.addScheDuleParams)
        this.locationSearchList = []

        return result.data.success
      } catch (error) {
        Promise.reject(err)
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

          if (!obj[shedule.date]) {
            obj[shedule.date] = {}

            let obj2 = {}
            obj2.date = shedule.date
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
        Promise.reject(err)
        return
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
        Promise.reject(err)
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
        Promise.reject(err)
        // return false
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
        Promise.reject(err)
        return false
      }
    },
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
        Promise.reject(err)
        return false
      }
    }
  }

})