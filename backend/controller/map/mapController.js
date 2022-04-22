const apiHandler = require("../../utils/api/api.js")
const responseHandler = require("../../utils/response.js")

const mapController = {
  searhPlace: async (req, res) => {
    let json;
    try {
      req.body.key = process.env.GOOGLEMAP_APIKEY
      req.body.inputtype = "textquery"
      console.log("req body", req.body);
      const placeSearchRes = await apiHandler.apiPlaceSearch(req.body)
      console.log("placeSearchRes", placeSearchRes.data);
      if (placeSearchRes.data.error_message) {
        return responseHandler.responseErr(res, placeSearchRes.data.error_message)
      }
      return responseHandler.success(res, placeSearchRes.data.candidates)
    } catch (err) {
      return responseHandler.catchErr(res, err)
    }
  },
  getPlaceDetail: async (req, res) => {
    try {
      req.body.key = process.env.GOOGLEMAP_APIKEY
      const placeDetailRes = await apiHandler.apiGetPlaceDetail(req.body)
      console.log("getPlaceDetail res", placeDetailRes);
      return responseHandler.success(res, placeDetailRes.data.result)
    } catch (err) {
      console.log("getPlaceDetail err", err);
      return responseHandler.catchErr(res, err)
    }
  },
}

module.exports = mapController