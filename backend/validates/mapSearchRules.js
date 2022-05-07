const { body } = require("express-validator");

const mapSearchRules = [
  body("fields")
    .notEmpty()
    .withMessage("fields 欄位必填")
    .isString()
    .withMessage("fields 格式不符"),
  body("input")
    .notEmpty()
    .withMessage("input 欄位必填")
    .isString()
    .withMessage("input 格式不符"),
]

module.exports = mapSearchRules