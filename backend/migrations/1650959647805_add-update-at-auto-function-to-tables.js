/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON main_schedule
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON daily_schedule
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON single_schedule
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON member
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = pgm => {};
