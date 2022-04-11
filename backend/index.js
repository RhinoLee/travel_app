const express = require("express");
const app = express();
const cors = require('cors')
const db = require("./db.js");
const port = process.env.PORT || 5001;
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
}
app.use(cors(corsOptions))
app.use(jsonParser);
app.use(urlencodedParser);


app.listen(port, () => {
  db.connect();
  console.log(`Example app listening on port ${port}`);
});