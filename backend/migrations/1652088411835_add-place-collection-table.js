/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE place_collection (
      id SERIAL PRIMARY KEY,
      place_name VARCHAR(100) NOT NULL,
      place_id VARCHAR(300) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      member_id INTEGER,
      CONSTRAINT 
        fk_member
          FOREIGN KEY(member_id)
            REFERENCES member(id)
            ON DELETE CASCADE
    )
  `)

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON place_collection
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE place_collection
  `)
};
