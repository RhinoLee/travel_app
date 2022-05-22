/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE member 
    ADD COLUMN verified SMALLINT NOT NULL DEFAULT 0
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE member 
    DROP COLUMN verified
  `)
};
