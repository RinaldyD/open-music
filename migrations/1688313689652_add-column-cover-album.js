/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql('ALTER TABLE albums ADD COLUMN cover VARCHAR(100)');
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', 'cover');
};
