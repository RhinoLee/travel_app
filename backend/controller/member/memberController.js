const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const jwtHandler = require("../../utils/jwtHandler.js")
const memberModel = require("../../model/member/memberModel")
const uploadImage = require('../../utils/uploadImage')

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

    bcrypt.compare(req.body.password, findMemberResult.rows[0].password, async (bcryptErr, bcryptRes) => {
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

      try {
        const accessToken = await jwtHandler.signAccessToken(jwtData)
        const refreshToken = await jwtHandler.signRefreshToken(jwtData)
        json = {
          success: true,
          refreshToken
        }

        res.setHeader("Access-Control-Expose-Headers", "Authorization")
        res.setHeader('Authorization', 'Bearer ' + accessToken);

        return res.status(200).json(json)
      } catch (error) {
        json = {
          success: false,
          error: error
        }

        return res.status(500).json(json)
      }

      // jwt.sign(jwtData, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 }, function (jwtErr, jwtToken) {
      //   if (!jwtToken) {
      //     json = {
      //       success: false,
      //       error: jwtErr
      //     }

      //     return res.status(500).json(json)
      //   }

      //   json = {
      //     success: true,
      //   }

      //   res.setHeader("Access-Control-Expose-Headers", "Authorization")
      //   res.setHeader('Authorization', 'Bearer ' + jwtToken);

      //   return res.status(200).json(json)
      // });


    })
  },
  getMemberInfo: async (req, res) => {
    let json;
    const { id, email } = req.jwtData

    try {
      const result = await memberModel.findMemberByEmail(email)
      if (result && result.rows.length === 1) {
        json = {
          success: true,
          memberInfo: {
            id: result.rows[0].id,
            email: result.rows[0].email,
            avatar: result.rows[0].avatar,
          }
        }
        return res.status(200).json(json)
      } else {
        json = {
          success: false,
          error: "認證錯誤"
        }
        return res.status(401).json(json)
      }
    } catch (error) {
      json = {
        success: false,
        error
      }
      return res.status(500).json(json)
    }

  },
  updateMemberAvatar: async (req, res) => {
    let json;
    const { id } = req.jwtData
    try {
      const file = req.file
      const imageUrl = await uploadImage(file, id)
      const result = await memberModel.updateMemberAvatar({ id, avatar: imageUrl })
      console.log("avatar controller result", result);
      if (result.success) {
        json = {
          success: true,
          avatar: result.result.rows[0].avatar,
        }
        return res.status(200).json(json)
      }

      json = {
        success: false,
        errors: ["資料庫存取失敗"]
      }
      return res.status(500).json(json)
    } catch (error) {
      console.log("avatar controller error", error);
      json = {
        success: false,
        errors: error
      }
      return res.status(500).json(json)
    }
  },
  refreshToken: async (req, res) => {
    let json;
    try {
      const refreshToken = req.body.refreshToken
      const { id, email } = await jwtHandler.verifyRefreshToken(refreshToken)
      const accessToken = await jwtHandler.signAccessToken({ id, email })
      const refToken = await jwtHandler.signRefreshToken({ id, email })

      json = {
        success: true,
        accessToken,
        refreshToken: refToken
      }
      return res.status(200).json(json)
    } catch (error) {
      json = {
        success: false,
        error
      }
      return res.status(401).json(json)
    }
  }
}

module.exports = memberController