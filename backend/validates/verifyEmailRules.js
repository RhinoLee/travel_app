const { body } = require("express-validator");

const verifyEmailRules = [
  body("email")
    .notEmpty()
    .withMessage("email欄位必填")
    .isEmail()
    .withMessage("email格式不符")
]

module.exports = verifyEmailRules