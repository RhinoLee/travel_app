const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const validateRequest = {
  validates: (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }
    next()
  },
  checkJWT: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const jwtData = jwt.verify(token, process.env.JWT_KEY)
      req.jwtData = jwtData
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token 認證失敗",
      })
    }
  },
  geographyFormat: (req, res, next) => {
    // req.location: {lat: 22.7652114, lng: 121.1647656}
    // 'POINT(-118.4079 33.9434)'
    const { lat, lng } = req.body.location
    req.location = `POINT(${lng} ${lat})`
    next()
  }
}

module.exports = validateRequest