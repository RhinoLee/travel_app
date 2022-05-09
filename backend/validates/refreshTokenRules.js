const { body } = require("express-validator");

const refreshTokenRules = [
  body("refreshToken")
    .notEmpty()
    .withMessage("refreshToken 欄位必填")
    .isString()
    .withMessage("refreshToken 格式不符"),
]

module.exports = refreshTokenRules