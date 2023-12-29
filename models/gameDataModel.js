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
  ratingPeak: {
    type: Number,
    default: 1200,
  },
  ratingPlays: {
    type: Number,
    default: 0,
  },
  kfactor: {
    type: Number,
    default: 100,
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
      id: '658da979d693ce462c4999bf',
      target: 'welcome',
      solutions: ['bem-vindo'],
      rating: 490,
    },
  },
  lastPlayed: {
    type: Number,
    default: dateToNumberStyleDate(Date.now()),
  },
  dictionary: {
    type: String,
    default: 'Brazil',
  },
  footsteprank: {
    type: Number,
    default: 2,
  },
  timePlayingLifetime: {
    type: Number,
    default: 0,
  },
  timePlayingToday: {
    type: Number,
    default: 0,
  },
  stepsTakenLifetime: {
    type: Number,
    default: 0,
  },
  stepsTakenToday: {
    type: Number,
    default: 0,
  },
  collectedWordsDayStart: {
    type: Number,
    default: 0,
  },
  streakRecord: {
    type: Number,
    default: 0,
  },
  streakToday: {
    type: Number,
    default: 0,
  },
  streakCurrent: {
    type: Number,
    default: 0,
  },
  sound: {
    type: Boolean,
    default: true,
  },
  timer: {
    type: Boolean,
    default: true,
  },
  blurred: {
    type: Boolean,
    default: false,
  },
});

const GameData = mongoose.model(
  'GameData',
  gameDataSchema,
  'User Game Data',
);

module.exports = GameData;
