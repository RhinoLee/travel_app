const db = require("../db")
const singleScheduleModel = {
  create: async ({ title, place_name, place_id, date, start_time, end_time, member_id, main_schedule_id }) => {
    const query = {
      text: `INSERT INTO single_schedule (title, place_name, place_id, date, start_time, end_time, member_id, main_schedule_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      values: [title, place_name, place_id, date, start_time, end_time, member_id, main_schedule_id]
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
      text: "SELECT * from single_schedule WHERE member_id = $1",
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
      text: "SELECT * from single_schedule WHERE id = $1",
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

module.exports = singleScheduleModel