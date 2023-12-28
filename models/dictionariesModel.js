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
    unique: true,
    trim: true,
  },
  target: {
    type: String,
    required: [
      true,
      'A dictionary entry must have a target language',
    ],
    unique: true,
    trim: true,
  },
});

const Dictionary = mongoose.model(
  'Dictionary',
  dictionarySchema,
  'dictionaries',
);

module.exports = Dictionary;
