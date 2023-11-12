const mongoose = require('mongoose');

const dicEntrySchema = new mongoose.Schema({
  target: {
    type: String,
    required: [
      true,
      'A dictionary entry must have a target',
    ],
    unique: true,
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
});

const DicEntry = mongoose.model(
  'DicEntry',
  dicEntrySchema,
  'PT-EN Dictionary'
);

module.exports = DicEntry;
