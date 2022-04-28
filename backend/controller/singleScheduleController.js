const singleScheduleModel = require("../model/singleScheduleModel")
const responseHandler = require("../utils/response.js")

const singleScheduleController = {
  create: async (req, res) => {
    try {
      const { title, place_name, place_id, date, start_time, end_time, member_id, main_schedule_id } = req.body
      const result = await singleScheduleModel.create({ title, place_name, place_id, date, start_time, end_time, member_id, main_schedule_id })
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
  getAllSchedules: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const result = await singleScheduleModel.getAllSchedules(member_id)
      if (result && result.rows.length >= 0) {
        return responseHandler.success(res, { mainScheduleList: result.rows })
      }

      responseHandler.responseErr(res, "取得資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
  getSchedule: async (req, res) => {
    console.log("getSchedule");
    console.log("getSchedule id", req.params.id);
    try {
      const schedule_id = req.params.id
      const result = await singleScheduleModel.getSchedule(schedule_id)
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, { mainscheduleInfo: result.rows[0] })
      }

      responseHandler.responseErr(res, "取得資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
}

module.exports = singleScheduleController