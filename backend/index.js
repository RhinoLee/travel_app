const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = process.env.PORT || 5003;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const validateRequest = require("./middleware/validateRequest")
const jwtHandler = require("./utils/jwtHandler.js")

// Rules of Validate
const registerRules = require("./validates/registerRules")
const loginRules = require("./validates/loginRules")
const refreshTokenRules = require("./validates/refreshTokenRules")
const mainScheduleRules = require("./validates/mainScheduleRules")
const singleScheduleCreateRules = require("./validates/singleScheduleCreateRules")
const singleScheduleUpdateRules = require("./validates/singleScheduleUpdateRules")
const mapDerectionsRules = require("./validates/mapDirectionsRules")
const mapSearchRules = require("./validates/mapSearchRules")
const mapDetailsRules = require("./validates/mapDetailsRules")
const placeCollectionCreateRules = require("./validates/placeCollectionCreateRules")


// controller
const mapController = require("./controller/map/mapController")
const memberController = require("./controller/member/memberController")
const mainScheduleController = require("./controller/mainScheduleController")
const singleScheduleController = require("./controller/singleScheduleController")
const placeCollectionController = require("./controller/placeCollectionController")

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
}
app.use(cors(corsOptions))
app.use(jsonParser);
app.use(urlencodedParser);

// Map
app.post("/api/placeSearch", jwtHandler.verifyAccessToken, mapSearchRules, validateRequest.validates, mapController.searhPlace)
app.post("/api/placeDetail", jwtHandler.verifyAccessToken, mapDetailsRules, validateRequest.validates, mapController.getPlaceDetail)
app.post("/api/getDirections", jwtHandler.verifyAccessToken, mapDerectionsRules, validateRequest.validates, mapController.getDirections)

// Member
app.post("/api/memberRegister",
  registerRules,
  validateRequest.validates,
  memberController.register
)

app.post("/api/memberLogin", loginRules, validateRequest.validates, memberController.login)
app.post("/api/memberInfo", jwtHandler.verifyAccessToken, memberController.getMemberInfo)
app.post("/api/refreshToken", refreshTokenRules, validateRequest.validates, memberController.refreshToken)

// Travel Schedule
app.post("/api/mainScheduleCreate",
  jwtHandler.verifyAccessToken,
  mainScheduleRules,
  validateRequest.validates,
  mainScheduleController.create
)

app.post("/api/singleScheduleCreate",
  jwtHandler.verifyAccessToken,
  singleScheduleCreateRules,
  validateRequest.validates,
  validateRequest.geographyFormat,
  singleScheduleController.create
)

app.patch("/api/singleSchedule/:id",
  jwtHandler.verifyAccessToken,
  singleScheduleUpdateRules,
  validateRequest.validates,
  singleScheduleController.update
)

app.delete("/api/singleSchedule/:id",
  jwtHandler.verifyAccessToken,
  singleScheduleController.delete
)

app.get("/api/mainSchedules", jwtHandler.verifyAccessToken, mainScheduleController.getAllSchedules)
app.get("/api/mainSchedule/:id", jwtHandler.verifyAccessToken, mainScheduleController.getSchedule)
app.get("/api/mainSchedule/:id/singleSchedules", jwtHandler.verifyAccessToken, singleScheduleController.getAllSchedules)

// place_collection
app.post("/api/placeCollection", 
  jwtHandler.verifyAccessToken,
  placeCollectionCreateRules,
  validateRequest.validates,
  validateRequest.geographyFormat,
  placeCollectionController.create
)

app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});