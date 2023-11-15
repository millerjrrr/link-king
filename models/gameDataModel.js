const mongoose = require('mongoose');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

const gameDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Game data must be linked to a user'],
    unique: [
      true,
      'A user can only have one game data document',
    ],
  },
  dueToday: {
    type: Array,
    default: [],
  },
  repeats: {
    type: Array,
    default: [],
  },
  index: {
    type: Number,
    default: 0,
  },
  lastPlayed: {
    type: Number,
    default: dateToNumberStyleDate(Date.now()) - 1,
  },
});

const GameData = mongoose.model(
  'GameData',
  gameDataSchema,
  'gameData',
);

module.exports = GameData;
