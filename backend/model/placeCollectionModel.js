const db = require("../db")
const placeCollectionModel = {
  findCollectWithPlaceId: async(place_id) => {
    const query = {
      text: "SELECT * FROM place_collection WHERE place_id = $1",
      values: [place_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
  create: async ({ place_name, place_id, location, member_id }) => {
    const query = {
      text: `INSERT INTO place_collection (place_name, place_id, location, member_id)
            VALUES($1, $2, $3, $4) RETURNING *`,
      values: [place_name, place_id, location, member_id]
    }

    try {
      const result = await db.query(query)
      return result
    } catch (err) {
      return err
    }
  },
}

module.exports = placeCollectionModel