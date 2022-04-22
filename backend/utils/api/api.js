const axios = require("axios")

// google map
const mapRequest = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/"
})


// google map 
const apiHandler = {
  apiPlaceSearch: (params) => mapRequest.get("/place/findplacefromtext/json", { params }),
  apiGetPlaceDetail: (params) => mapRequest.get("/place/details/json", { params })
}

// module.exports = apiPlaceSearch = (params) => mapRequest.get("/place/autocomplete/json", { params })
// module.exports = apiGetPlaceDetail = (placeId) => mapRequest.get(`/place/details/json?place_id=${placeId}&fields=name%2Crating%2Cformatted_phone_number&key=${process.env.GOOGLEMAP_APIKEY}`)

module.exports = apiHandler