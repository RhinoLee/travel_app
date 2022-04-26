const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = process.env.PORT || 5003;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const { validationResult } = require("express-validator");
const validateRequest = require("./middleware/validateRequest")

// Rules of Validate
const registerRules = require("./validates/registerRules")
const mainScheduleRules = require("./validates/mainScheduleRules")

// controller
const mapController = require("./controller/map/mapController")
const memberController = require("./controller/member/memberController")
const mainScheduleController = require("./controller/mainScheduleController")

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
}
app.use(cors(corsOptions))
app.use(jsonParser);
app.use(urlencodedParser);

// Map
app.post("/api/placeSearch", validateRequest.checkJWT, mapController.searhPlace)
app.post("/api/placeDetail", validateRequest.checkJWT, mapController.getPlaceDetail)

// Member
app.post("/api/memberRegister",
  registerRules,
  validateRequest.validates,
  memberController.register
)

app.post("/api/memberLogin", memberController.login)
app.post("/api/memberInfo", validateRequest.checkJWT, memberController.getMemberInfo)

// Travel Schedule
app.post("/api/mainScheduleCreate", 
  validateRequest.checkJWT,
  mainScheduleRules,
  validateRequest.validates,
  mainScheduleController.create
)

app.get("/api/mainSchedules", validateRequest.checkJWT, mainScheduleController.getAllSchedules)
app.get("/api/mainSchedule/:id", validateRequest.checkJWT, mainScheduleController.getSchedule)


app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});