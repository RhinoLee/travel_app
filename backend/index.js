const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = process.env.PORT || 5003;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const validateRequest = require("./middleware/validateRequest")
const upload = require("./middleware/multer")
const jwtHandler = require("./utils/jwtHandler.js")
// Rules of Validate
const registerRules = require("./validates/registerRules")
const loginRules = require("./validates/loginRules")
const refreshTokenRules = require("./validates/refreshTokenRules")
const avatarRules = require("./validates/avatarRules")
const mainSchedulePictureRules = require("./validates/mainSchedulePictureRules")
const mainScheduleRules = require("./validates/mainScheduleRules")
const singleScheduleCreateRules = require("./validates/singleScheduleCreateRules")
const singleScheduleUpdateRules = require("./validates/singleScheduleUpdateRules")
const mapDerectionsRules = require("./validates/mapDirectionsRules")
const mapSearchRules = require("./validates/mapSearchRules")
const mapDetailsRules = require("./validates/mapDetailsRules")
const placeCollectionCreateRules = require("./validates/placeCollectionCreateRules")
const verifyEmailRules = require("./validates/verifyEmailRules")
const resetPasswordRules = require("./validates/resetPasswordRules")


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
app.post("/api/member/register",
  registerRules,
  validateRequest.validates,
  memberController.register
)

app.post("/api/member/login", loginRules, validateRequest.validates, memberController.login)
app.get("/api/member/memberInfo", jwtHandler.verifyAccessToken, memberController.getMemberInfo)
// app.patch("/api/memberInfo", jwtHandler.verifyAccessToken, memberController.updateMemberInfo)
app.put("/api/member/avatar",
  jwtHandler.verifyAccessToken,
  upload.single('avatar'), 
  avatarRules,
  memberController.updateMemberAvatar
)

app.post("/api/member/refreshToken", refreshTokenRules, validateRequest.validates, memberController.refreshToken)
app.post("/api/member/verifyMember", jwtHandler.verifyAccessToken, memberController.verifyMember)
app.post("/api/member/verifyEmail", verifyEmailRules, validateRequest.validates, memberController.verifyEmail)
app.post("/api/member/resetPasswordEmail", verifyEmailRules, validateRequest.validates, memberController.resetPasswordEmail)
app.post("/api/member/resetPassword", jwtHandler.verifyAccessToken, resetPasswordRules, validateRequest.validates, memberController.resetPassword)
// Travel Schedule
app.post("/api/mainScheduleCreate",
  jwtHandler.verifyAccessToken,
  upload.single('picture'),
  mainScheduleRules,
  mainSchedulePictureRules,
  validateRequest.validates,
  mainScheduleController.create
)

app.put("/api/mainScheduleUpdate/:id",
  jwtHandler.verifyAccessToken,
  upload.single('picture'),
  mainScheduleRules,
  mainSchedulePictureRules,
  validateRequest.validates,
  mainScheduleController.update
)

app.delete("/api/mainSchedule/:id",
  jwtHandler.verifyAccessToken,
  mainScheduleController.delete
)

app.post("/api/singleScheduleCreate",
  jwtHandler.verifyAccessToken,
  singleScheduleCreateRules,
  validateRequest.validates,
  validateRequest.geographyFormat,
  singleScheduleController.create
)

app.put("/api/singleSchedule/:id",
  jwtHandler.verifyAccessToken,
  singleScheduleUpdateRules,
  validateRequest.validates,
  singleScheduleController.update
)

app.put("/api/singleSchedule_date",
  jwtHandler.verifyAccessToken,
  singleScheduleController.updateDate
)

app.delete("/api/singleSchedule/:id",
  jwtHandler.verifyAccessToken,
  singleScheduleController.delete
)

app.get("/api/mainSchedules", jwtHandler.verifyAccessToken, mainScheduleController.getAllSchedules)
app.get("/api/mainSchedule/:id", jwtHandler.verifyAccessToken, mainScheduleController.getSchedule)

// place_collection
app.post("/api/placeCollection",
  jwtHandler.verifyAccessToken,
  placeCollectionCreateRules,
  validateRequest.validates,
  validateRequest.geographyFormat,
  placeCollectionController.create
)

app.get("/api/placeCollection", jwtHandler.verifyAccessToken, placeCollectionController.getAll)
app.delete("/api/placeCollection/:id", jwtHandler.verifyAccessToken, placeCollectionController.delete)

app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});