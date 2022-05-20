/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE member 
    ADD COLUMN avatar VARCHAR(300)
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE member 
    DROP COLUMN avatar
  `)
};
