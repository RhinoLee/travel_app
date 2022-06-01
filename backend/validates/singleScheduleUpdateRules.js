const { body } = require("express-validator");

const singleScheduleUpdateRules = [
  body("title")
    .notEmpty()
    .withMessage("title 欄位必填")
    .isString()
    .withMessage("title 格式不符"),
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
  // body("end_time")
  //   .notEmpty()
  //   .withMessage("end_time 欄位必填")
  //   .matches(/([0-9]|1\d|2[0-3]):([1-5]{2}|6[0]|[0-9])/)
  //   .withMessage("end_time 格式不符"),
  body("day_order")
    .notEmpty()
    .withMessage("day_order 欄位必填")
    .custom((value, { req }) => {
      // 判斷數字或浮點數
      if (Number.isInteger(value) && value > 0) return true

      throw new Error("day_order 格式不符")
    })
    .withMessage("day_order 格式不符"),
]

module.exports = singleScheduleUpdateRules