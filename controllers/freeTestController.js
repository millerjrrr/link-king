const jStat = require('jstat');
const DicEntry = require('../models/dicEntryModel');
const catchAsync = require('../utils/catchAsync');

exports.nextWord = catchAsync(async (req, res) => {
  data = await nextWordFromRating(req.body.rating);
  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.startTest = catchAsync(async (req, res) => {
  data = await nextWordFromRating(1200);
  res.status(200).render('freeTest', {
    title: 'Free Test',
    data,
  });
});

const nextWordFromRating = async (rating) => {
  const dictionarySize = 3173; //NEEDS TO BE MAINTAINED
  let lookUpRank = Math.floor(
    jStat.normal.cdf(rating, 1200, 400) * dictionarySize -
      50 +
      Math.random() * 100,
  );
  lookUpRank = lookUpRank < 0 ? 0 : lookUpRank;
  lookUpRank =
    lookUpRank > dictionarySize
      ? dictionarySize
      : lookUpRank;

  const data = await DicEntry.findOne({
    rank: lookUpRank,
  }).select('-_id -visits -rank -__v');

  return data;
};
