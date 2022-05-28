const { body } = require("express-validator");

const mainScheduleRules = [
  body("startDate")
    .isISO8601()
    .withMessage("時間格式不符"),
  body("endDate")
    .isISO8601()
    .withMessage("時間格式不符"),
  body("title")
    .notEmpty()
    .withMessage("title 欄位必填")
    .isString()
    .withMessage("title 格式不符"),
]

module.exports = mainScheduleRules