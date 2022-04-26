const mainScheduleModel = require("../model/mainScheduleModel")
const responseHandler = require("../utils/response.js")

const mainScheduleController = {
  create: async (req, res) => {
    try {
      const { title, startDate, endDate, memberId } = req.body
      const result = await mainScheduleModel.create({ title, startDate, endDate, memberId })
      console.log("mainScheduleController.create result", result);
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, { id: result.rows[0].id })
      }

      responseHandler.responseErr(res, "新增資料失敗")
    } catch (error) {
      console.log("mainScheduleController.create error", error);
      return responseHandler.catchErr(res, error)
    }
  },
  getAllSchedules: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const result = await mainScheduleModel.getAllSchedules(member_id)
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
      const result = await mainScheduleModel.getSchedule(schedule_id)
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, { id: result.rows[0] })
      }

      responseHandler.responseErr(res, "取得資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
}

module.exports = mainScheduleController