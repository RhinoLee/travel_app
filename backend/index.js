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
const registerRules = require("./validates/registerRules")

// controller
const mapController = require("./controller/map/mapController")
const memberController = require("./controller/member/memberController")

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
    validateRequest.register,
  memberController.register
)

app.post("/api/memberLogin", memberController.login)


app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});