/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    ADD COLUMN location GEOGRAPHY(POINT)
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    DROP COLUMN location
  `)
};
