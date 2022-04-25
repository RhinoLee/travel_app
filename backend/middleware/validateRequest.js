const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const validateRequest = {
  register: (req, res, next) => {
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
  }
}

module.exports = validateRequest