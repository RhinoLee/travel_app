/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE place_collection 
    ADD COLUMN location GEOGRAPHY(POINT) NOT NULL
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE place_collection 
    DROP COLUMN location
  `)
};
