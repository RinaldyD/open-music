/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'playlist_songs',
    'unique_playlist_id_and_songs_id',
    'UNIQUE(playlist_id, song_id)'
  );
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.playlist_id_playlist.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.songs_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'playlist_songs',
    'fk_playlist_songs.playlist_id_playlist.id'
  );
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.songs_id_songs.id');
};
