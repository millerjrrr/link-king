const mongoose = require('mongoose');

const dicEntrySchema = new mongoose.Schema({
  target: {
    type: String,
    required: [
      true,
      'A dictionary entry must have a target',
    ],
    unique: true,
    trim: true,
    maxLength: [
      39,
      'A target must have less than 40 characters',
    ],
  },
  solutions: {
    type: Array,
    required: [
      true,
      'A dictionary entry must have solution(s)',
    ],
  },
  rating: {
    type: Number,
    default: 1200,
  },
  rank: {
    type: Number,
    required: [
      true,
      'A dictionary entry must have a unique rank',
    ],
    unique: true,
  },
  visits: {
    type: Number,
    default: 0,
  },
  dictionaryName: {
    type: String,
    required: [
      true,
      'A dictionary entry must belong to a dictionary',
    ],
  },
});

const DicEntry = mongoose.model(
  'DicEntry',
  dicEntrySchema,
  'Dictionary',
);

module.exports = DicEntry;
