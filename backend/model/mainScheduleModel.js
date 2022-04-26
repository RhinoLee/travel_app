const db = require("../db")
const mainScheduleModel = {
  create: async ({ title, startDate, endDate, memberId }) => {
    const query = {
      text: `INSERT INTO main_schedule (title, start_date, end_date, member_id)
            VALUES($1, $2, $3, $4) RETURNING *`,
      values: [title, startDate, endDate, memberId]
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
      text: "SELECT * from main_schedule WHERE member_id = $1",
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
      text: "SELECT * from main_schedule WHERE id = $1",
      values: [schedule_id]
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