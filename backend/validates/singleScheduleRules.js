const { body } = require("express-validator");

const singleScheduleRules = [
  body("member_id")
    .notEmpty()
    .withMessage("member_id 欄位必填"),
  body("main_schedule_id")
    .notEmpty()
    .withMessage("main_schedule_id 欄位必填"),
  body("title")
    .notEmpty()
    .withMessage("title 欄位必填")
    .isString()
    .withMessage("title 格式不符"),
  body("place_name")
    .notEmpty()
    .withMessage("place_name 欄位必填")
    .isString()
    .withMessage("place_name 格式不符"),
  body("place_id")
    .notEmpty()
    .withMessage("place_id 欄位必填")
    .isString()
    .withMessage("place_id 格式不符"),
  body("date")
    .notEmpty()
    .withMessage("date 欄位必填")
    .matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
    .withMessage("date 格式不符"),
  body("start_time")
    .notEmpty()
    .withMessage("start_time 欄位必填")
    .matches(/([0-9]|1\d|2[0-3]):([1-5]{2}|6[0]|[0-9])/)
    .withMessage("start_time 格式不符"),
  body("end_time")
    .notEmpty()
    .withMessage("end_time 欄位必填")
    .matches(/([0-9]|1\d|2[0-3]):([1-5]{2}|6[0]|[0-9])/)
    .withMessage("end_time 格式不符"),
]

module.exports = singleScheduleRules