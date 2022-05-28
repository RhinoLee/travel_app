const mainScheduleModel = require("../model/mainScheduleModel")
const singleScheduleModel = require("../model/singleScheduleModel")
const responseHandler = require("../utils/response.js")
const uploadCloudImage = require("../utils/uploadCloudImage")
const deleteCloudImage = require("../utils/deleteCloudImage")

const mainScheduleController = {
  create: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const { title, startDate, endDate } = req.body
      const result = await mainScheduleModel.create({ title, startDate, endDate, member_id })
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
    try {
      const member_id = req.jwtData.id
      const main_schedule_id = req.params.id

      const mainScheduleResult = await mainScheduleModel.getSchedule(main_schedule_id)
      const scheduleListResult = await singleScheduleModel.getAllSchedules({ member_id, main_schedule_id })
      if (scheduleListResult && scheduleListResult.rows.length >= 0) {

        const mainScheduleList = responseHandler.formatSchedule(scheduleListResult.rows)

        return responseHandler.success(res, {
          mainscheduleInfo: mainScheduleResult.rows[0],
          allSchedules: mainScheduleList,
        })
      }

      responseHandler.responseErr(res, "取得資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
  update: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const main_schedule_id = req.params.id
      const picture = req.file
      const category = "main_schedule"
      let imageUrl = null

      console.log("mainScheduleController update req picture", picture);
      // 如果前端有傳 picture
      if (picture) {
        const mainScheduleResult = await mainScheduleModel.getSchedule(main_schedule_id)
        const originPicture = mainScheduleResult.rows[0].picture
        if (originPicture) {
          const deleteResult = await deleteCloudImage({ userId: member_id, fileLink: originPicture, category })
        }

        imageUrl = await uploadCloudImage(picture, member_id, category)
      }

      const { startDate, endDate, title } = req.body
      const result = await mainScheduleModel.update({ member_id, main_schedule_id, startDate, endDate, title, imageUrl })
      console.log("mainScheduleController update req", { member_id, main_schedule_id, startDate, endDate, title, imageUrl });
      if (result && result.rows.length >= 0) {
        return responseHandler.success(res, { mainSchedule: result.rows[0] })
      }

      responseHandler.responseErr(res, "存取資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  }
}

module.exports = mainScheduleController