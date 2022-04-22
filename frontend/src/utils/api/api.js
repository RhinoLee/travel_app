import axios from "axios"

// google map
const mapRequest = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/"
})

// backend google map
const mapRequest2 = axios.create({
  baseURL: "http://localhost:5003/api/"
})


// google map 
export const apiGetPlaceId = ({ lat, lng }) => mapRequest.get(`/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLEMAP_APIKEY}`)

// backend google map
export const apiPlaceSearch = (params) => mapRequest2.post("/placeSearch", params)
export const apiGetPlaceDetail = (params) => mapRequest2.post("/placeDetail", params)