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
}

module.exports = placeCollectionController