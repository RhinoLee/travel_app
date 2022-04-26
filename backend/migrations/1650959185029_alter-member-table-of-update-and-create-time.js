/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE member
    ADD COLUMN created_at timestamptz DEFAULT NOW(),
    ADD COLUMN updated_at timestamptz DEFAULT NOW()
  `)
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE member
    DROP COLUMN created_at,
    DROP COLUMN updated_atmpm
  `)
};
