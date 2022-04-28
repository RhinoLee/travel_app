/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    ADD COLUMN date CHAR(10) NOT NULL,
    ADD COLUMN main_schedule_id INTEGER,
    ADD CONSTRAINT 
      fk_main_schedule
        FOREIGN KEY(main_schedule_id)
          REFERENCES main_schedule(id)
          ON DELETE CASCADE
  `)
};

exports.down = pgm => { 
  pgm.sql(`
    ALTER TABLE single_schedule 
    DROP COLUMN date
    DROP COLUMN main_schedule_id
  `)
};
