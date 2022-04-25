/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE member (
      id SERIAL PRIMARY KEY,
      email VARCHAR(254) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE member
  `)
};
