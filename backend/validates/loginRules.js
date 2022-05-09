const { body } = require("express-validator");

const loginRules = [
  body("email")
    .notEmpty()
    .withMessage("帳號欄位必填")
    .isEmail()
    .withMessage("帳號格式不符"),
  body("password")
    .notEmpty()
    .withMessage("密碼欄位必填")
]

module.exports = loginRules