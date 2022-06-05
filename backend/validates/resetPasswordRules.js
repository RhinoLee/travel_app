const { body } = require("express-validator");

const resetPasswordRules = [
  // body("password")
  //   .isLength({ min: 8 })
  //   .withMessage("密碼需要至少 8 碼"),
  body("repassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("密碼確認不一致")
    } else {
      return true
    }
  })
    .withMessage("密碼確認不一致"),
]

module.exports = resetPasswordRules