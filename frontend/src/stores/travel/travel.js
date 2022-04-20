import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => {
    return {
      addTravle: {
        startDate: "",
        endDate: "",
      }
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
    }
  }

})