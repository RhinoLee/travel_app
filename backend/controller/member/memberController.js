const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const jwtHandler = require("../../utils/jwtHandler.js")
const sendEmail = require("../../utils/sendEmail.js")
const memberModel = require("../../model/member/memberModel")
const uploadCloudImage = require("../../utils/uploadCloudImage")
const deleteCloudImage = require("../../utils/deleteCloudImage")
const responseHandler = require("../../utils/response")

const memberController = {
  register: async (req, res) => {
    let json;
    const { email, password } = req.body
    const saltRounds = 10;
    // 密碼加密後存入 DB
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) return responseHandler.catchErr(res, err)

      const params = {
        email,
        password: hash,
        verified: 0, // 預設為未驗證
      }

      try {
        const createResult = await memberModel.createMember(params)
        const id = createResult.rows[0].id
        const verifyEmailToken = await jwtHandler.signAccessToken({ id, email })
        await sendEmail(email, verifyEmailToken)

        json = {
          success: true,
        }
        return res.status(200).json(json)
      } catch (error) {
        return responseHandler.catchErr(res, error)
      }
    })
  },
  login: async (req, res) => {
    let json;
    const findMemberResult = await memberModel.findMemberByEmail(req.body.email)

    if (findMemberResult.rows.length < 1) return responseHandler.responseErr(res, "member 不存在", 404)
    if (!findMemberResult.rows[0].verified) return responseHandler.responseErr(res, "信箱尚未驗證", 400, {
      id: findMemberResult.rows[0].id,
      email: findMemberResult.rows[0].email,
    })

    bcrypt.compare(req.body.password, findMemberResult.rows[0].password, async (bcryptErr, bcryptRes) => {
      if (bcryptErr) return responseHandler.catchErr(res, bcryptErr)

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
        return responseHandler.catchErr(res, error)
      }
    })
  },
  getMemberInfo: async (req, res) => {
    try {
      const result = await memberModel.findMemberByEmail(req.jwtData.email)
      if (result && result.rows.length === 0) return responseHandler.responseErr(res, "member 不存在", 404)
      const { id, email, avatar } = result.rows[0]
      const json = {
        success: true,
        memberInfo: {
          id,
          email,
          avatar,
        }
      }
      return res.status(200).json(json)

    } catch (error) {
      return responseHandler.catchErr(res, error)
    }

  },
  updateMemberAvatar: async (req, res) => {
    const { id } = req.jwtData
    try {
      const file = req.file
      const category = "avatar"

      const memberResult = await memberModel.findMemberById(id)
      const originAvatar = memberResult.rows[0].avatar
      if (originAvatar) {
        const deleteResult = await deleteCloudImage({ userId: id, avatarLink: originAvatar, category })
      }

      const imageUrl = await uploadCloudImage(file, id, category)
      const result = await memberModel.updateMemberAvatar({ id, avatar: imageUrl })
      const json = {
        success: true,
        avatar: result.rows[0].avatar,
      }
      return res.status(200).json(json)

    } catch (error) {
      console.log("avatar controller error", error);
      return responseHandler.catchErr(res, error)
    }
  },
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken
      const { id, email } = await jwtHandler.verifyRefreshToken(refreshToken)
      const accessToken = await jwtHandler.signAccessToken({ id, email })
      const refToken = await jwtHandler.signRefreshToken({ id, email })

      const json = {
        success: true,
        accessToken,
        refreshToken: refToken
      }
      return res.status(200).json(json)
    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
  verifyMember: async (req, res) => {
    try {
      const result = await memberModel.verifyMember({ verified: 1, email: req.jwtData.email })
      const json = {
        success: true,
        memberInfo: result.rows[0],
      }
      return res.status(200).json(json)
    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { id, email } = req.body
      const verifyEmailToken = await jwtHandler.signAccessToken({ id, email })
      await sendEmail(email, verifyEmailToken)

      json = {
        success: true,
      }
      return res.status(200).json(json)
    } catch (error) {
      return responseHandler.catchErr(res, error)
    }
  }
}

module.exports = memberController