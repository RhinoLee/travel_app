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
    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
  getPlaceDetail: async (req, res) => {
    try {
      req.body.key = process.env.GOOGLEMAP_APIKEY
      req.body.language = "zh-TW"
      const placeDetailRes = await apiHandler.apiGetPlaceDetail(req.body)
      console.log("getPlaceDetail res", placeDetailRes);
      if (placeDetailRes && placeDetailRes.data.result) {
        // const getImagePromises = []
        // // get photo
        // placeDetailRes.data.result.photos.forEach((photo) => {
        //   getImagePromises.push(apiHandler.apiGetPlacePhotos({
        //     maxwidth: 400,
        //     photo_reference: photo.photo_reference,
        //     key: process.env.GOOGLEMAP_APIKEY
        //   }))
        //   // images.push(getPhotoRes.data)
        //   // console.log("getPhotoRes", images);
        // })

        // const results = await Promise.all(getImagePromises)
        // results.forEach((result, idx) => {
        //   if (idx === 0) {
        //     console.log(result);
        //     // console.log("result", result.data);
        //   }
        // })

        const obj = {
          name: placeDetailRes.data.result.name,
          place_id:  placeDetailRes.data.result.place_id,
          address: placeDetailRes.data.result.formatted_address,
          icon: placeDetailRes.data.result.icon,
          phone_number: placeDetailRes.data.result.formatted_phone_number,
          rating: placeDetailRes.data.result.rating,
          user_ratings_total: placeDetailRes.data.result.user_ratings_total,
          // photos: images,
          opening_hours: placeDetailRes.data.result.opening_hours,
        }

        return responseHandler.success(res, obj)
      } else {
        return responseHandler.responseErr(res, placeDetailRes.data.error_message)
      }
    } catch (error) {
      console.log("getPlaceDetail err", error);
      return responseHandler.catchErr(res, error)
    }
  },
}

module.exports = mapController