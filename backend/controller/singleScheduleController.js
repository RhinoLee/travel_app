const singleScheduleModel = require("../model/singleScheduleModel")
const responseHandler = require("../utils/response.js")

const singleScheduleController = {
  create: async (req, res) => {
    try {
      const location = req.location
      const member_id = req.jwtData.id
      const { title, place_name, place_id, date, start_time, day_order, main_schedule_id } = req.body
      const result = await singleScheduleModel.create({ title, place_name, place_id, date, start_time, location, member_id, day_order, main_schedule_id })
      console.log("singleScheduleController.create result", result);
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, { id: result.rows[0] })
      }

      responseHandler.responseErr(res, "新增資料失敗")
    } catch (error) {
      console.log("singleScheduleController.create error", error);
      return responseHandler.catchErr(res, error)
    }
  },
  update: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const result = await singleScheduleModel.update(req.body, member_id)
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, { id: result.rows[0] })
      }
    } catch (error) {
      console.log("singleScheduleController.update error", error);
      return responseHandler.catchErr(res, error)
    }
  },
  updateDate: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const { dates, main_schedule_id } = req.body
      let promises = []

      dates.forEach((date, idx) => {
        promises.push(singleScheduleModel.updateDate(
          {
            date: date.date,
            day_order: idx + 1,
            main_schedule_id,
            member_id
          }
        ))
      })

      const result = await Promise.all(promises)
      console.log("singleScheduleController.update result", result);
      if (result) {
        return responseHandler.success(res)
      }
    } catch (error) {
      console.log("singleScheduleController.update error", error);
      return responseHandler.catchErr(res, error)
    }
  },
  delete: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const id = req.params.id
      const result = await singleScheduleModel.delete({ member_id, id })
      console.log("singleScheduleController.delete result", result);
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, result.rows[0])
      }
    } catch (error) {
      console.log("singleScheduleController.delete error", error);
      return responseHandler.catchErr(res, error)
    }
  }
  // getSchedule: async (req, res) => {
  //   console.log("getSchedule");
  //   console.log("getSchedule id", req.params.id);
  //   try {
  //     const schedule_id = req.params.id
  //     const result = await singleScheduleModel.getSchedule(schedule_id)
  //     if (result && result.rows.length === 1) {
  //       return responseHandler.success(res, { mainscheduleInfo: result.rows[0] })
  //     }

  //     responseHandler.responseErr(res, "取得資料失敗")

  //   } catch (error) {
  //     return responseHandler.catchErr(res, error)
  //   }
  // },
}

module.exports = singleScheduleController