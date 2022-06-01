const { body } = require("express-validator");

const singleScheduleDateRules = [
  body("dates")
    .isArray()
    .withMessage("dates 格式不符")
    .custom(value => {
      if (value.length === 0) return true
      let validated = true

      for(let i = 0; i < value.length; i++) {
        if (typeof value[i] === "string") {
          validated = false
          break;
        }
      }

      if (!validated) throw new Error("dates 格式不符")
      return true
    })
    .withMessage("dates 格式不符")
]

module.exports = singleScheduleDateRules