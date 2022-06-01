/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    ALTER COLUMN end_time DROP NOT NULL
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    ALTER COLUMN end_time CHAR(5) SET NOT NULL
  `)
};
