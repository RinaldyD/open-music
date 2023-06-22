const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().require(),
});

module.exports = { PlaylistPayloadSchema, PlaylistSongPayloadSchema };
