/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`ALTER DATABASE fundb SET timezone TO 'UTC'`);
};

exports.down = pgm => {
  pgm.sql(`ALTER DATABASE fundb SET timezone TO 'Asia/Taipei'`);
};
