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
  geographyFormat: (req, res, next) => {
    // req.location: {lat: 22.7652114, lng: 121.1647656}
    // 'POINT(-118.4079 33.9434)'
    const { lat, lng } = req.body.location
    req.location = `POINT(${lng} ${lat})`
    next()
  }
}

module.exports = validateRequest