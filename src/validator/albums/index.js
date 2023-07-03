const InvariantError = require('../../exception/InvariantError');
const { AlbumPayloadSchema, CoverPayloadSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },

  validateCoverPayload: (headers) => {
    const validationResult = CoverPayloadSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { AlbumsValidator };
