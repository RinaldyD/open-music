const autoBind = require('auto-bind');
const { mapDBToModelSong } = require('../../utils');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const params = request.query;

    const fetchSong = await this._service.getSongs(params);

    const songs = fetchSong.map((song) => mapDBToModelSong(song));

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });

    return response;
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;
    const { id } = request.params;
    await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Song berhasil diperbarui',
    });
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus',
    });
    return response;
  }
}

module.exports = SongsHandler;
