exports.up = (pgm) => {
  pgm.addConstraint(
    'songs',
    'fk_songs.albumId_album.id',
    'FOREIGN KEY ("albumId") REFERENCES albums(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.albumId_album.id');
};
