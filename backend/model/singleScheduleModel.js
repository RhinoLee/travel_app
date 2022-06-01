const db = require("../db")
const singleScheduleModel = {
  create: async ({ title, place_name, place_id, date, start_time, location, member_id, day_order, main_schedule_id }) => {
    const query = {
      text: `INSERT INTO single_schedule (title, place_name, place_id, date, start_time, location, member_id, day_order, main_schedule_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [title, place_name, place_id, date, start_time, location, member_id, day_order, main_schedule_id]
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
      text: `SELECT ST_X(location::geometry) AS lng, ST_Y(location::geometry) AS lat, id, main_schedule_id, title, place_id, place_name, start_time, date, day_order
              from single_schedule 
              WHERE member_id = $1 AND main_schedule_id = $2 
              ORDER BY date, start_time ASC`,
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
  update: async ({ id, title, date, start_time, day_order }, member_id) => {
    const query = {
      text: `
      UPDATE single_schedule 
      SET title = $1, date = $2, start_time = $3, day_order = $4
      WHERE id = $5 AND member_id = $6
      RETURNING *
      `,
      values: [title, date, start_time, day_order, id, member_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  updateDate: async ({ date, day_order, main_schedule_id, member_id }) => {
    const query = {
      text: `
      UPDATE single_schedule 
      SET date = $1
      WHERE day_order = $2 AND main_schedule_id = $3 AND member_id = $4
      RETURNING date
      `,
      values: [date, day_order, main_schedule_id, member_id]
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
      text: `DELETE FROM single_schedule 
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
  // getSchedule: async (schedule_id) => {
  //   const query = {
  //     text: "SELECT * from single_schedule WHERE id = $1",
  //     values: [schedule_id]
  //   }

  //   try {
  //     const result = await db.query(query)
  //     return result
  //   } catch (err) {
  //     return err
  //   }
  // },
}

module.exports = singleScheduleModel