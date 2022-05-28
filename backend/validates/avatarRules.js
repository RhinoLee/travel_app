const avatarRules = (req, res, next) => {
  let json;
  if (!req.file) {
    json = {
      success: false,
      errors: "image 欄位必填"
    }
    return res.status(400).json(json)
  }

  if (!req.file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    json = {
      success: false,
      errors: "image 格式須為 jpg, jpeg, png"
    }
    return res.status(400).json(json)
  }


  const sizeLimit = 5 * 1024 * 1024
  if (req.file.size > sizeLimit) {
    json = {
      success: false,
      errors: "檔案大小須小於 5 mb"
    }
    return res.status(400).json(json)
  }

  next()
}

module.exports = avatarRules