const { Schema, model, Types } = require('mongoose');

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    team: {
      type: String,
      trim: true,
    },
    number: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Player = model('Player', playerSchema);
const isValidId = (id) => Types.ObjectId.isValid(id);

module.exports = { Player, isValidId };
