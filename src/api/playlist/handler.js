const autoBind = require('auto-bind');

class playlistHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    await this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylists({
      name,
      owner: credentialId,
    });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistsOwner(id, credentialId);
    await this._service.deletePlaylist(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.verifySongId(songId);
    await this._service.postSongToPlaylist(playlistId, songId);
    await this._service.addActivities(playlistId, songId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan di Playlist',
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._service.getPlaylistById(playlistId);
    const song = await this._service.getSongsFromPlaylist(playlistId);
    const playlistSongs = playlist.map((p) => ({
      id: p.id,
      name: p.name,
      username: p.username,
      songs: song,
    }));

    const response = h.response({
      status: 'success',
      data: {
        playlist: Object.assign({}, ...playlistSongs),
      },
    });

    return response;
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(songId);
    await this._service.deleteActivities(playlistId, songId, credentialId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari Playlist',
    };
  }

  async getPlaylistActivitiesHanlder(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const getActivities = await this._service.getPlaylistSongActivities(
      playlistId,
      credentialId,
    );

    const response = h.response({
      status: 'success',
      data: {
        playlistId: getActivities[0].playlist_id,
        activities: getActivities.map((a) => ({
          username: a.username,
          title: a.title,
          action: a.action,
          time: a.time,
        })),
      },
    });
    return response;
  }
}

module.exports = playlistHandler;
