const db = require("../db")
const singleScheduleModel = {
  create: async ({ title, place_name, place_id, date, start_time, end_time, location, member_id, main_schedule_id }) => {
    const query = {
      text: `INSERT INTO single_schedule (title, place_name, place_id, date, start_time, end_time, location, member_id, main_schedule_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [title, place_name, place_id, date, start_time, end_time, location, member_id, main_schedule_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  getAllSchedules: async ({ member_id, main_schedule_id }) => {
    const query = {
      text: `SELECT ST_X(location::geometry) AS lng, ST_Y(location::geometry) AS lat, id, main_schedule_id, title, place_id, place_name, start_time, end_time, date
              from single_schedule 
              WHERE member_id = $1 AND main_schedule_id = $2 ORDER BY date ASC`,
      values: [member_id, main_schedule_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      console.log("getAllSchedules Model err", err);
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