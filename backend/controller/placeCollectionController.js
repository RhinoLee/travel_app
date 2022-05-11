const placeCollectionModel = require("../model/placeCollectionModel")
const responseHandler = require("../utils/response.js")

const placeCollectionController = {
  create: async (req, res) => {
    try {
      const location = req.location
      const member_id = req.jwtData.id
      const { place_name, place_id } = req.body
      const result = await placeCollectionModel.create({ place_name, place_id, location, member_id })
      console.log("placeCollectionController.create result", result);
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, result.rows[0])
      }

      responseHandler.responseErr(res, "新增資料失敗")
    } catch (error) {
      console.log("placeCollectionController.create error", error);
      return responseHandler.catchErr(res, error)
    }
  },
  getAll: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const result = await placeCollectionModel.getAll(member_id)
      if (result && result.rows.length >= 0) {
        return responseHandler.success(res, { placeCollections: result.rows })
      }

      responseHandler.responseErr(res, "取得資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
  delete: async (req, res) => {
    try {
      const member_id = req.jwtData.id
      const id = req.params.id 
      const result = await placeCollectionModel.delete({ member_id, id })
      console.log("placeCollectionController.delete result", result);
      if (result && result.rows.length === 1) {
        return responseHandler.success(res, result.rows[0])
      }

      responseHandler.responseErr(res, "取得資料失敗")

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  }
}

module.exports = placeCollectionController