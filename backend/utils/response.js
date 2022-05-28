const responseHandler = {
  success: (res, results) => {
    const json = {
      success: true,
      results,
    };
    return res.status(200).json(json);
  },
  responseErr: (res, errorMsg, status=400, data=null) => {
    const json = {
      success: false,
      error: errorMsg,
      data
    };

    return res.status(status).json(json);
  },
  catchErr: (res, error) => {
    console.log("catchErr", error);
    const json = {
      success: false,
      error: "資料庫存取失敗"
    }
    return res.status(500).json(json);
  },
  formatSchedule: (scheduleList) => {
    // console.log("formatSchedule scheduleList", scheduleList);
    let list = []
    let dateList = []
    scheduleList.forEach(schedule => {
      dateList.push(schedule.date)
    })

    const uniqueDateList = [...new Set(dateList)]

    uniqueDateList.forEach(date => {
      let obj = {}
      obj.date = date
      obj.scheduleList = scheduleList.filter(schedule => schedule.date === date)
      list.push(obj)
    })

    console.log("formatSchedule result", list);
    return list

  }
}

module.exports = responseHandler