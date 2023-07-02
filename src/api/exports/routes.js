const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistid}',
    handler: handler.postExportsPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
