const { body } = require("express-validator");

const mapDetailsRules = [
  body("place_id")
    .notEmpty()
    .withMessage("place_id 欄位必填")
    .isString()
    .withMessage("place_id 格式不符"),
]

module.exports = mapDetailsRules