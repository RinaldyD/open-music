const mapDBToModelAlbum = ({ id, name, year }, song) => ({
  id,
  name,
  year,
  songs: song,
});

const mapDBToModelSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = {
  mapDBToModelAlbum,
  mapDBToModelSong,
};
