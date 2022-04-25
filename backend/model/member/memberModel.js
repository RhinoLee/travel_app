const db = require("../../db")

const memberModel = {
  findMemberByEmail: async (email) => {
    const query = {
      text: "SELECT id FROM member WHERE email = $1",
      values: [email]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.findMemberByEmail result", result);
      return result
    } catch (err) {
      console.log("memberModel.findMemberByEmail err", err);
      return err
    }
  },
  createMember: async ({ email, password }) => {
    const query = {
      text: `INSERT INTO 
        member(email, password) 
        VALUES($1, $2) RETURNING *`,
      values: [email, password]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.createMember result", result);
      return { success: true, result }
    } catch(error) {
      console.log("memberModel.createMember error", error);
      return { success: false, error }
    }
  }
}

module.exports = memberModel