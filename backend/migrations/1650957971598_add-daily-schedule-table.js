/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE daily_schedule (
      id SERIAL PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      main_schedule_id INTEGER,
      member_id INTEGER,
      CONSTRAINT 
        fk_member
          FOREIGN KEY(member_id)
            REFERENCES member(id)
            ON DELETE CASCADE,
      CONSTRAINT 
        fk_main_schedule
          FOREIGN KEY(main_schedule_id)
            REFERENCES main_schedule(id)
            ON DELETE CASCADE
    )
  `)
};

exports.down = pgm => { 
  pgm.sql(`
    DROP TABLE daily_schedule
  `)
};
