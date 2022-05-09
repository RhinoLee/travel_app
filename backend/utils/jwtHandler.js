const jwt = require('jsonwebtoken');

const jwtHandler = {
  signAccessToken: ({ id, email }) => {
    return new Promise((resolve, reject) => {
      const payload = {
        id,
        email
      }
      const secrect = process.env.JWT_ACCESS_SECRET_KEY
      const options = {
        expiresIn: "24h",
        // expiresIn: 60 * 60 * 24,
        issuer: "travel.rhinoman.com.tw",
        audience: id.toString()
      }

      jwt.sign(payload, secrect, options, function (jwtErr, jwtToken) {
        if (jwtErr) return reject(jwtErr)
        resolve(jwtToken)
      });
    })
  },
  signRefreshToken: ({ id, email }) => {
    return new Promise((resolve, reject) => {
      const payload = {
        id,
        email
      }
      const secrect = process.env.JWT_REFRESH_SECRET_KEY
      const options = {
        expiresIn: "48h",
        issuer: "travel.rhinoman.com.tw",
        audience: id.toString()
      }

      jwt.sign(payload, secrect, options, (jwtErr, jwtToken) => {
        if (jwtErr) return reject(jwtErr)
        resolve(jwtToken)
      });
    })
  },
  verifyAccessToken: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const jwtData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)
      req.jwtData = jwtData
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error,
      })
    }
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (jwtErr, payload) => {
        if (jwtErr) return reject(jwtErr)
        const id = payload.id
        const email = payload.email
        resolve({ id, email })
      })
    })
  }
}

module.exports = jwtHandler