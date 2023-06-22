const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, songService, validator }) => {
    const playlistsHandler = new PlaylistHandler(
      service,
      songService,
      validator
    );
    server.route(routes(playlistsHandler));
  },
};
