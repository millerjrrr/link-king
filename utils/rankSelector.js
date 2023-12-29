const jStat = require('jstat');
const Dictionary = require('../models/dictionariesModel');

const rankSelector = async (gd, newRating) => {
  const dictionary = await Dictionary.findOne({
    name: gd.dictionary,
  });
  const dictionarySize = dictionary.size;
  if (gd.playingMode === 'progressive') {
    return gd.footsteprank % dictionarySize;
  } else if (gd.playingMode === 'ratings') {
    return Math.floor(
      jStat.normal.cdf(newRating, 1200, 400) *
        dictionarySize -
        50 +
        Math.random() * 1000,
    );
  }
};

module.exports = rankSelector;
