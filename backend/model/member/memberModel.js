const db = require("../../db")

const memberModel = {
  findMemberByEmail: async (email) => {
    const query = {
      text: "SELECT * FROM member WHERE email = $1",
      values: [email]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.findMemberByEmail result", result);
      return result
    } catch (err) {
      console.log("memberModel.findMemberByEmail err", err);
      throw err
    }
  },
  findMemberById: async (id) => {
    const query = {
      text: "SELECT * FROM member WHERE id = $1",
      values: [id]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.findMemberById result", result);
      return result
    } catch (err) {
      console.log("memberModel.findMemberById err", err);
      throw err
    }
  },
  createMember: async ({ email, password, verified }) => {
    const query = {
      text: `INSERT INTO 
        member(email, password, verified) 
        VALUES($1, $2, $3) RETURNING *`,
      values: [email, password, verified]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.createMember result", result);
      return result
      // return { success: true, result }
    } catch (error) {
      console.log("memberModel.createMember error", error);
      throw error
      // return { success: false, error }
    }
  },
  updateMemberAvatar: async ({ id, avatar }) => {
    const query = {
      text: `
        UPDATE member 
        SET avatar = $1
        WHERE id = $2
        RETURNING avatar
      `,
      values: [avatar, id]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.updateMemberAvatar result", result);
      return result
    } catch (error) {
      console.log("memberModel.updateMemberAvatar error", error);
      throw error
    }
  },
  verifyMember: async ({ verified, email }) => {
    const query = {
      text: `
        UPDATE member 
        SET verified = $1
        WHERE email = $2
        RETURNING email, verified
      `,
      values: [verified, email]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.verifyMember result", result);
      return result
    } catch (error) {
      console.log("memberModel.verifyMember error", error);
      throw error
    }
  },
  resetPassword: async ({ email, password }) => {
    const query = {
      text: `
        UPDATE member 
        SET password = $1
        WHERE email = $2
        RETURNING id
      `,
      values: [password, email]
    }

    try {
      const result = await db.query(query)
      console.log("memberModel.resetPassword result", result);
      return result
    } catch (error) {
      console.log("memberModel.resetPassword error", error);
      throw error
    }
  },
  deleteAvatar: async (id) => {
    const query = {
      text: `
      UPDATE member
      SET avatar = $1
      WHERE id = $2
      RETURNING *
      `,
      values: [null, id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  delete: async ({ member_id, email }) => {
    const query = {
      text: `DELETE FROM member 
              WHERE id = $1 AND email = $2
            `,
      values: [member_id, email]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
}

module.exports = memberModel