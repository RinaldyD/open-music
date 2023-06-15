const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapDBToModelAlbum } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1,$2,$3,$4,$4) RETURNING id',
      values: [id, name, year, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModelAlbum);
  }

  async getAlbumById(id) {
    const album = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const resultAlbum = await this._pool.query(album);

    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const song = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1',
      values: [id],
    };

    const resultSong = await this._pool.query(song);

    return { album: resultAlbum.rows[0], songs: resultSong.rows };
  }

  async editAlbumById(id, { name, year }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updateAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal memperbarui album. Id tidak dapat ditemukan'
      );
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak dapat ditemukan');
    }
  }
}

module.exports = AlbumsService;
