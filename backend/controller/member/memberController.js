const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const memberModel = require("../../model/member/memberModel")

const memberController = {
  register: async (req, res) => {
    let json;
    const { email, password } = req.body
    const saltRounds = 10;
    // 密碼加密後存入 DB
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        json = {
          success: false,
          error: err
        }
        return res.status(500).json(json)
      } else {
        const params = {
          email,
          password: hash
        }

        const createResult = await memberModel.createMember(params)

        if (createResult.success) {
          json = {
            success: true,
          }
          return res.status(200).json(json)
        } else {
          json = {
            success: false,
            error: createResult.error
          }
          return res.status(500).json(json)
        }
      }
    })
  },
  login: async (req, res) => {
    let json;
    const findMemberResult = await memberModel.findMemberByEmail(req.body.email)
    if (findMemberResult.rows.length < 1) {
      json = {
        success: false,
        error: "認證失敗"
      }

      return res.status(401).json(json)
    }

    bcrypt.compare(req.body.password, findMemberResult.rows[0].password, (bcryptErr, bcryptRes) => {
      if (!bcryptRes) {
        json = {
          success: false,
          error: "認證失敗"
        }

        return res.status(401).json(json)
      }

      const jwtData = {
        id: findMemberResult.rows[0].id,
        email: findMemberResult.rows[0].email,
      }

      jwt.sign(jwtData, process.env.JWT_KEY, { expiresIn: 60 * 60 }, function (jwtErr, jwtToken) {
        if (!jwtToken) {
          json = {
            success: false,
            error: jwtErr
          }

          return res.status(500).json(json)
        }

        json = {
          success: true,
        }

        res.setHeader("Access-Control-Expose-Headers", "Authorization")
        res.setHeader('Authorization', 'Bearer ' + jwtToken);

        return res.status(200).json(json)
      });
    })
  }
}

module.exports = memberController