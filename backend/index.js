const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = process.env.PORT || 5003;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// controller
const mapController = require("./controller/map/mapController")

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
}
app.use(cors(corsOptions))
app.use(jsonParser);
app.use(urlencodedParser);

// Map
app.post("/api/placeSearch", mapController.searhPlace)
app.post("/api/placeDetail", mapController.getPlaceDetail)


app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});