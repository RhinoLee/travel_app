import { defineStore } from "pinia"
import { apiGetPlaceId, apiGetPlaceDetail, apiPlaceSearch } from "@/utils/api/api"

export const useTravelStore = defineStore('travel', {
  state: () => {
    return {
      addTravle: {
        startDate: "",
        endDate: "",
      },
      plansList: [
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
      nowSelectPlan: {
        id: 1,
        pic: "https://picsum.photos/480/260?random=1",
        title: "花東五天四夜",
        startDate: "2022-01-01",
        endDate: "2022-01-05",
        intro: "內容內容內容內容內容內容內容內容內容內容內容內容內容內容",
        planOfTravel: [
          {
            id: 1,
            date: "2022-01-01",
            plans: [
              {
                title: "吃早餐",
                startTime: "08:00",
                endTime: "09:00",
                location: {
                  lat: 23.979054,
                  lng: 121.5687386,
                },
                placeId: "ChIJIcmKe26faDQRUGz9-QB3KkQ",
                placeName: "慶豐麵店",
                note: "早餐好好吃"
              },
              {
                title: "吃午餐",
                startTime: "11:00",
                endTime: "12:00",
                location: {
                  lat: 23.2773379,
                  lng: 121.4227963,
                },
                placeId: "ChIJ2Yu0oWBobzQRyO9EGWwuduQ",
                placeName: "Sinasera 24 法式餐廳",
                note: "午餐好好吃"
              },
            ],
          },
          {
            id: 2,
            date: "2022-01-02",
            plans: [
              {
                title: "看海",
                startTime: "09:00",
                endTime: "10:00",
                location: {
                  lat: 22.7652114,
                  lng: 121.1647656,
                },
                placeId: "ChIJ7XzyAE25bzQRHMT043RH2cA",
                placeName: "台東森林公園活水湖",
                note: "海好好看"
              },
            ],
          },
          {
            id: 3,
            date: "2022-01-03",
            plans: [],
          },
          {
            id: 4,
            date: "2022-01-04",
            plans: [
              {
                title: "跑跑卡丁車",
                startTime: "14:00",
                endTime: "15:00",
                location: {
                  lat: 23.040601,
                  lng: 121.170015,
                },
                placeId: "ChIJzf-hVvYJbzQRHz9gdJ1d4t4",
                placeName: "關山隼F１小型賽車場&漆彈場&民宿",
                note: "卡丁車好好玩"
              },
              {
                title: "吃晚餐",
                startTime: "18:00",
                endTime: "19:00",
                location: {
                  lat: 22.8108284,
                  lng: 121.1509126,
                },
                placeId: "ChIJuckixHe7bzQROQursUPnkWs",
                placeName: "星星部落景觀咖啡",
                note: "晚餐好好吃"
              },
            ]
          }
        ],
      },
      nowDayPlanId: null
    }
  },
  getters: {
    dutationDays(state) {
      if (!state.addTravle.startDate || !state.addTravle.endDate) return false

      const startDateMs = new Date(state.addTravle.startDate).getTime()
      const endDateMs = new Date(state.addTravle.endDate).getTime()
      const durationMs = endDateMs - startDateMs
      const dutationDays = durationMs / (24 * 60 * 60 * 1000)

      return dutationDays
    },
    // nowDayPlan(state) {
    //   if (Number.isInteger(state.nowDayPlanId)) {

    //   }
    // }
  },
  actions: {
    getDayPlan(dayPlanId) {
      this.nowDayPlanId = dayPlanId
    },
    async getLocationInfo(placeId) {
      console.log("placeId", placeId);
      const params = {
        place_id: placeId
      }
      const placeDetailRes = await apiGetPlaceDetail(params)
    },
    async placeSearch(searchTxt) {
      try {
        const params = {
          input: searchTxt,
          fields: "formatted_address,name,rating,opening_hours,geometry,place_id"
        }
        const searchResult = apiPlaceSearch(params)
        console.log("placeSearch", searchResult);
        return searchResult
      } catch(err) {
        console.log("placeSearch err", err);
        return err
      }
    }
  }

})