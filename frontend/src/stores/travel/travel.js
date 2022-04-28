import { defineStore } from "pinia"
import { useMemberStore } from "../member"
import { apiGetPlaceId, apiGetPlaceDetail, apiPlaceSearch, apiCreateMainSchedule, apiGetMainSchedule, apiGetAllMainSchedules, apiCreateSingleSchedule, apiGetSingleSchedule } from "@/utils/api/api"
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
      // singleScheduleList: [
      //   {
      //     id: 1,
      //     date: "2022-01-01",
      //     plans: [
      //       {
      //         id: 1,
      //         title: "吃早餐",
      //         startTime: "08:00",
      //         endTime: "09:00",
      //         location: {
      //           lat: 23.979054,
      //           lng: 121.5687386,
      //         },
      //         placeId: "ChIJIcmKe26faDQRUGz9-QB3KkQ",
      //         placeName: "慶豐麵店",
      //         note: "早餐好好吃"
      //       },
      //       {
      //         id: 2,
      //         title: "吃午餐",
      //         startTime: "11:00",
      //         endTime: "12:00",
      //         location: {
      //           lat: 23.2773379,
      //           lng: 121.4227963,
      //         },
      //         placeId: "ChIJ2Yu0oWBobzQRyO9EGWwuduQ",
      //         placeName: "Sinasera 24 法式餐廳",
      //         note: "午餐好好吃"
      //       },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     date: "2022-01-02",
      //     plans: [
      //       {
      //         id: 3,
      //         title: "看海",
      //         startTime: "09:00",
      //         endTime: "10:00",
      //         location: {
      //           lat: 22.7652114,
      //           lng: 121.1647656,
      //         },
      //         placeId: "ChIJ7XzyAE25bzQRHMT043RH2cA",
      //         placeName: "台東森林公園活水湖",
      //         note: "海好好看"
      //       },
      //     ],
      //   },
      //   {
      //     id: 3,
      //     date: "2022-01-03",
      //     plans: [],
      //   },
      //   {
      //     id: 4,
      //     date: "2022-01-04",
      //     plans: [
      //       {
      //         id: 4,
      //         title: "跑跑卡丁車",
      //         startTime: "14:00",
      //         endTime: "15:00",
      //         location: {
      //           lat: 23.040601,
      //           lng: 121.170015,
      //         },
      //         placeId: "ChIJzf-hVvYJbzQRHz9gdJ1d4t4",
      //         placeName: "關山隼F１小型賽車場&漆彈場&民宿",
      //         note: "卡丁車好好玩"
      //       },
      //       {
      //         id: 5,
      //         title: "吃晚餐",
      //         startTime: "18:00",
      //         endTime: "19:00",
      //         location: {
      //           lat: 22.8108284,
      //           lng: 121.1509126,
      //         },
      //         placeId: "ChIJuckixHe7bzQROQursUPnkWs",
      //         placeName: "星星部落景觀咖啡",
      //         note: "晚餐好好吃"
      //       },
      //     ]
      //   }
      // ],
      // 單日計畫日期
      nowSelectDate: "",
      // 單日計畫底下的單一計畫 ID
      nowPlanId: null,
      // 目前選取到地點的相關資訊
      placeDetail: null
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
    // 總旅程裡的當日計畫
    nowSelectSchedule(state) {
      let dailyPlan = { scheduleList: [] }
      if (state.nowSelectDate) {
        dailyPlan.scheduleList = state.singleScheduleList.filter(plan => plan.date === state.nowSelectDate)
      } else {
        dailyPlan.scheduleList = state.singleScheduleList
      }
      return dailyPlan
    },
    memberId() {
      const memberStore = useMemberStore()
      return memberStore.memberInfo.id
    }
  },
  actions: {
    // getDailyPlan(dailyPlanId) {
    //   this.nowSelectDate = dailyPlanId
    // },
    async getLocationInfo(placeId) {
      const params = {
        place_id: placeId
      }

      try {
        const placeDetailRes = await apiGetPlaceDetail(params)

        console.log("placeDetailRes result", placeDetailRes);

        if (placeDetailRes && placeDetailRes.data.success) {
          this.placeDetail = placeDetailRes.data.results
        } else {
          this.placeDetail = {}
        }
      } catch (err) {
        this.placeDetail = {}
        errorHandler.catchError(err)
      }

    },
    async placeSearch(searchTxt) {
      try {
        const params = {
          input: searchTxt,
          fields: "formatted_address,name,rating,geometry,place_id"
        }
        const searchResult = await apiPlaceSearch(params)
        if (searchResult.data.success) {
          return this.locationSearchList = searchResult.data.results
        }

        this.locationSearchList = []
      } catch (error) {
        this.locationSearchList = []
        errorHandler.catchError(error)
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

        console.log("addMainSchedule params", params);
        const result = await apiCreateMainSchedule(params)

      } catch (error) {
        errorHandler.catchError(error)
      }
    },
    async getMainScheduleList() {
      try {
        const result = await apiGetAllMainSchedules()
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
        errorHandler.catchError(error)
      }
    },
    async getMainSchedule() {
      try {
        const result = await apiGetMainSchedule(this.nowMainScheduleId)
        if (result && result.data.success) {
          const { mainscheduleInfo } = result.data.results

          // 計算總天數
          mainscheduleInfo.daysList = dateHandler.toDaysList(mainscheduleInfo.start_date, mainscheduleInfo.end_date)

          this.mainScheduleInfo = mainscheduleInfo

          const singeScheduleResult = await this.getSingleSchedule()

          return
        }

        this.mainScheduleInfo = {}

      } catch (error) {
        errorHandler.catchError(error)
      }
    },
    async addSingleSchedule() {
      this.addScheDuleParams.member_id = this.memberId
      try {
        const result = await apiCreateSingleSchedule(this.addScheDuleParams)
        this.locationSearchList = []

        return result.data.success
      } catch (error) {
        errorHandler.catchError(error)
        return false
      }
    },
    async getSingleSchedule() {
      try {
        const result = await apiGetSingleSchedule(this.nowMainScheduleId)

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

      } catch (error) {
        errorHandler.catchError(error)
        return
      }

    }
  }

})