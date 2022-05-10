const { body } = require("express-validator");
const placeCollectionModel = require("../model/placeCollectionModel")

const placeCollectionCreateRules = [
  body("place_name")
    .notEmpty()
    .withMessage("place_name 欄位必填")
    .isString()
    .withMessage("place_name 格式不符"),
  body("place_id")
    .notEmpty()
    .withMessage("place_id 欄位必填")
    .isString()
    .withMessage("place_id 格式不符")
    .custom(value => {
      return placeCollectionModel.findCollectWithPlaceId(value).then(result => {
        if (result.rows.length >= 1) {
          throw new Error("place_id已經存在")
        } else {
          return true
        }
      });
    })
      .withMessage("地點已在收藏清單"),
  body("location")
    .notEmpty()
    .withMessage("location 欄位必填")
    .isObject()
    .withMessage("location 格式不符")
    .custom((value, { req }) => {
      // 判斷數字或浮點數
      const testNum = /^[+-]?\d+(\.\d+)?$/
      if (testNum.test(value.lat) && testNum.test(value.lng)) return true

      throw new Error("location 格式不符")
    })
    .withMessage("location 格式不符"),
]

module.exports = placeCollectionCreateRules