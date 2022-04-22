export const dateHandler = {
  getDayOfWeek: (dateVal) => {
    const dayList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    const dateStr = dateVal.replace(/-/g, "/")
    const date = new Date(dateStr)
    const day = date.getDay()
    
    return dayList[day]
  }
}