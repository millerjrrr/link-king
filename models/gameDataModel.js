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
  rating: {
    type: Number,
    default: 1200,
  },
  kfactor: {
    type: Number,
    default: 20,
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
  tail: { type: Array, default: [] },
  dicPlay: { type: Boolean, default: true },
  dicWord: {
    type: Object,
    default: {
      id: '655cb33efc432b6a6fac86f4',
      target: 'queda',
      solutions: ['fall'],
      rating: 1200,
    },
  },
  lastPlayed: {
    type: Number,
    default: dateToNumberStyleDate(Date.now()),
  },
  dictionary: {
    type: String,
    default: 'personal',
  },
  footsteprank: {
    type: Number,
    default: 2,
  },
});

const GameData = mongoose.model(
  'GameData',
  gameDataSchema,
  'gameData',
);

module.exports = GameData;
