/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    ADD COLUMN day_order SMALLINT NOT NULL
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE single_schedule 
    DROP COLUMN day_order
  `)
};
