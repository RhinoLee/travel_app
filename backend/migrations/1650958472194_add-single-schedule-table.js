/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE single_schedule (
      id SERIAL PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      place_name VARCHAR(100) NOT NULL,
      place_id VARCHAR(300) NOT NULL,
      start_time CHAR(5) NOT NULL,
      end_time CHAR(5) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      daily_schedule_id INTEGER,
      member_id INTEGER,
      CONSTRAINT 
        fk_member
          FOREIGN KEY(member_id)
            REFERENCES member(id)
            ON DELETE CASCADE,
      CONSTRAINT 
        fk_daily_schedule
          FOREIGN KEY(daily_schedule_id)
            REFERENCES daily_schedule(id)
            ON DELETE CASCADE
    )
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE single_schedule
  `)
};
