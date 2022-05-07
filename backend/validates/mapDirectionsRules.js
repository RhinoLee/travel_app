const { body } = require("express-validator");

const derectionsRules = [
  body("destination")
    .notEmpty()
    .withMessage("destination 欄位必填")
    .isString()
    .withMessage("destination 格式不符"),
  body("origin")
    .notEmpty()
    .withMessage("origin 欄位必填")
    .isString()
    .withMessage("origin 格式不符"),
  body("waypoints")
    .isArray()
    .withMessage("waypoints 格式不符")
    .custom(value => {
      if (value.length === 0) return true
      let validated = false
      value.forEach(item => {
        validated = typeof item === "string"
      })
      if (!validated) throw new Error("waypoints 格式不符")
      return true
    })
    .withMessage("waypoints 格式不符")
]

module.exports = derectionsRules