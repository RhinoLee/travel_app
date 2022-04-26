/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE main_schedule (
      id SERIAL PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      start_date TIMESTAMPTZ NOT NULL,
      end_date TIMESTAMPTZ NOT NULL,
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
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE main_schedule
  `)
};
