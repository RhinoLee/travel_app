const { body } = require("express-validator");
const memberModel = require("../model/member/memberModel")

const registerRules = [
  body("email")
    .isEmail()
    .withMessage("信箱格式不符"),
  body("email").custom(value => {
    return memberModel.findMemberByEmail(value).then(result => {
      if (result.rows.length >= 1) {
        throw new Error("帳號已經存在")
      } else {
        return true
      }
    });
  })
    .withMessage("帳號已經存在"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("密碼需要至少 8 碼"),
  body("repassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("密碼確認不一致")
    } else {
      return true
    }
  })
    .withMessage("密碼確認不一致"),
]

module.exports = registerRules