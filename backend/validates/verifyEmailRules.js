const { body } = require("express-validator");

const verifyEmailRules = [
  body("email")
    .notEmpty()
    .withMessage("email欄位必填")
    .isEmail()
    .withMessage("email格式不符"),
  body("id")
    .notEmpty()
    .withMessage("id欄位必填")
]

module.exports = verifyEmailRules