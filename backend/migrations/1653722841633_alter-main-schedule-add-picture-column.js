/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE main_schedule 
    ADD COLUMN picture VARCHAR(300)
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE main_schedule 
    DROP COLUMN picture
  `)
};
