const bcrypt = require("bcrypt")
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
  }
}

module.exports = memberController