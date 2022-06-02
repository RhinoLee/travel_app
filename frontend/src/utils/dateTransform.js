export const dateHandler = {
  getDayOfWeek: (dateVal) => {
    const dayList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    // const dateStr = dateVal.replace(/-/g, "/")
    const date = new Date(dateVal)
    const day = date.getDay()

    return dayList[day]
  },
  localFormatString: (dateStr) => {
    const localDateValue = new Date(dateStr)
    const year = localDateValue.getFullYear()
    const month = localDateValue.getMonth() + 1 < 10 ? "0" + (localDateValue.getMonth() + 1) : localDateValue.getMonth() + 1
    const date = localDateValue.getDate() < 10 ? "0" + localDateValue.getDate() : localDateValue.getDate()
    return `${year}-${month}-${date}`
  },
  dateFormatDate: (dateStr) => {
    const localDateValue = new Date(dateStr)
    return localDateValue
  },
  calcDurationDays: (startDate, endDate) => {
    const startDateMs = new Date(startDate).getTime()
    const endDateMs = new Date(endDate).getTime()
    const durationMs = endDateMs - startDateMs
    const durationDays = Math.ceil(durationMs / (24 * 60 * 60 * 1000))

    return durationDays
  },
  toDaysList: (startDate, endDate) => {
    // 回傳格式
    // daysList: [
    //   {
    //     date:"2022-04-23",
    //     day:"星期六"
    //   },
    // ]
    const daysList = []
    const durationDays = dateHandler.calcDurationDays(startDate, endDate)

    for (let i = 0; i <= durationDays; i++) {
      const localDateValue = new Date(startDate)
      localDateValue.setDate(localDateValue.getDate() + i)

      let obj = {}
      obj.date = dateHandler.localFormatString(localDateValue)
      obj.day = dateHandler.getDayOfWeek(localDateValue)

      daysList.push(obj)
    }

    return daysList
  },
  timeFormat: (hours, minute) => {
    const hoursStr = hours.toString().trim()
    const minuteStr = minute.toString().trim()

    const hoursFormate = hoursStr.length === 1 ? "0" + hoursStr : hoursStr
    const minuteFormate = minuteStr.length === 1 ? "0" + minuteStr : minuteStr
    return hoursFormate + ":" + minuteFormate
  },
  calcPlusTime: (time, num = 5) => {
    let endHour = Number(time.split(":")[0])
    let endMin = Number(time.split(":")[1])

    if (endMin + num > 59 && endHour <= 22) {
      endHour += 1
      endMin = (endMin + num) - 60

      return dateHandler.timeFormat(endHour, endMin)
    }

    if (endMin + num > 59 && endHour >= 23) {
      endHour = 23
      endMin = 59

      return dateHandler.timeFormat(endHour, endMin)
    }

    endMin = endMin + num
    return dateHandler.timeFormat(endHour, endMin)
  },
  calcMinusTime: (time, num = 5) => {
    // time 轉成分鐘
    // time - num = end_min
    // end_min 轉成時間格式

    const endHour = Number(time.split(":")[0])
    const endMin = Number(time.split(":")[1]) + endHour * 60
    const ceilNum = Math.ceil(num)

    const result = endMin - ceilNum
    const resultHour = Math.floor(result / 60)
    const resultMin = Math.floor(result % 60)

    return dateHandler.timeFormat(resultHour, resultMin)
  },
}