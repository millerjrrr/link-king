const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A dictionary entry must have a name'],
    unique: true,
    trim: true,
  },
  source: {
    type: String,
    required: [
      true,
      'A dictionary entry must have a source language',
    ],
  },
  target: {
    type: String,
    required: [
      true,
      'A dictionary entry must have a target language',
    ],
  },
  size: {
    type: Number,
    required: [true, 'A dictionary entry must have a size'],
  },
});

const Dictionary = mongoose.model(
  'Dictionary',
  dictionarySchema,
  'dictionaries',
);

module.exports = Dictionary;
