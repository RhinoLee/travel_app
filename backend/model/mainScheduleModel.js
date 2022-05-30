const db = require("../db")
const mainScheduleModel = {
  create: async ({ title, startDate, endDate, member_id }) => {
    const query = {
      text: `INSERT INTO main_schedule (title, start_date, end_date, member_id)
            VALUES($1, $2, $3, $4) RETURNING *`,
      values: [title, startDate, endDate, member_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  getAllSchedules: async (member_id) => {
    const query = {
      text: "SELECT * from main_schedule WHERE member_id = $1 ORDER BY start_date DESC",
      values: [member_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  getSchedule: async (schedule_id) => {
    const query = {
      text: "SELECT id, title, start_date, end_date, member_id, picture from main_schedule WHERE id = $1",
      values: [schedule_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  update: async ({ member_id, main_schedule_id, startDate, endDate, title, imageUrl }) => {
    const query = {
      text: `
      UPDATE main_schedule 
      SET title = $1, start_date = $2, end_date = $3, picture = COALESCE($4, picture)
      WHERE id = $5 AND member_id = $6
      RETURNING *
      `,
      values: [title, startDate, endDate, imageUrl, main_schedule_id, member_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  deletePicture: async ({ main_schedule_id, member_id }) => {
    const query = {
      text: `
      UPDATE main_schedule
      SET picture = $1
      WHERE id = $2 AND member_id = $3
      RETURNING *
      `,
      values: [null, main_schedule_id, member_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  delete: async ({ member_id, id }) => {
    const query = {
      text: `DELETE FROM main_schedule 
              WHERE member_id = $1 AND id = $2
              RETURNING id
            `,
      values: [member_id, id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
}

module.exports = mainScheduleModel