const GameData = require('../models/gameDataModel');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');
const rankSelector = require('../utils/rankSelector');
const calculateEloRating = require('./calculateEloRating');
const {
  selectorDicEntry,
  selectorTicket,
} = require('../utils/dictionarySelectors');

exports.wrongAnswer = async (req, gd) => {
  const DicEntry = selectorDicEntry(
    req.user.language.dictionary,
  );
  const Ticket = selectorTicket(
    req.user.language.dictionary,
  );

  const newUserRating = calculateEloRating.loser(
    gd.dicWord.rating,
    gd.rating,
    gd.kfactor,
  ); //rating management
  const kfactor = gd.kfactor === 20 ? 20 : gd.kfactor - 1; //rating management

  const lookUpRank = await rankSelector(gd, newUserRating);

  const dicWord = await DicEntry.findOneAndUpdate(
    {
      rank: lookUpRank,
    },
    {
      $inc: {
        visits: 1,
      },
    },
    {
      new: true,
    },
  );

  const newDicWord = {
    id: dicWord._id,
    target: dicWord.target,
    solutions: dicWord.solutions,
    rating: dicWord.rating,
  };

  const ticket = await Ticket.findOneAndUpdate(
    {
      userGDProfile: req.user.gdID,
      dicEntry: gd.dicWord.id,
    },
    {
      level: 1,
      dueDate: dateToNumberStyleDate(Date.now()) + 1,
    },
    {
      upsert: true,
      new: true,
    },
  ).populate({
    path: 'dicEntry', //potential issue
    select: 'target solutions',
  });

  // Modify the structure of the retrieved documents
  const newRepeat = {
    id: ticket._id,
    target: ticket.dicEntry.target,
    solutions: ticket.dicEntry.solutions,
    level: ticket.level,
  };

  const footsteprankInc =
    gd.playingMode === 'progressive' ? 1 : 0;

  gd.repeats.unshift(newRepeat);
  // Update GameData with new DicWord and DicPlay
  await GameData.findOneAndUpdate(
    { _id: req.user.gdID },
    {
      index: 0,
      repeats: gd.repeats.slice(0, 5),
      dicPlay: false,
      dicWord: newDicWord,
      tail: [gd.dicWord.solutions[0]],
      $inc: {
        ratingPlays: 1, //rating management
        footsteprank: footsteprankInc,
        stepsTakenToday: 1,
        stepsTakenLifetime: 1,
        timePlayingToday: req.body.time,
        timePlayingLifetime: req.body.time,
      },
      streakCurrent: 0,
      rating: newUserRating, //rating management
      kfactor, //rating management
    },
    {
      runValidators: true,
    },
  );
};

exports.correctAnswer = async (req, gd) => {
  const DicEntry = selectorDicEntry(
    req.user.language.dictionary,
  );

  const newUserRating = calculateEloRating.winner(
    gd.rating,
    gd.dicWord.rating,
    gd.kfactor,
  ); //rating management
  const kfactor = gd.kfactor === 20 ? 20 : gd.kfactor - 1; //rating management

  const lookUpRank = await rankSelector(gd, newUserRating);

  const dicWord = await DicEntry.findOneAndUpdate(
    {
      rank: lookUpRank,
    },
    {
      $inc: {
        visits: 1,
      },
    },
    {
      new: true,
    },
  );

  const modifiedResult = {
    id: dicWord._id,
    target: dicWord.target,
    solutions: dicWord.solutions,
    rating: dicWord.rating,
  };

  const streakTodayPlus =
    gd.streakCurrent >= gd.streakToday ? 1 : 0;

  const streakRecordPlus =
    gd.streakCurrent >= gd.streakRecord ? 1 : 0;

  const ratingPeak =
    gd.ratingPeak > newUserRating
      ? gd.ratingPeak
      : newUserRating; // rating management

  const footsteprankInc =
    gd.playingMode === 'progressive' ? 1 : 0;

  gd.tail.unshift(gd.dicWord.target);
  // Update GameData with new DicWord and DicPlay
  await GameData.findOneAndUpdate(
    { _id: req.user.gdID },
    {
      dicPlay: true,
      dicWord: modifiedResult,
      tail: gd.tail.slice(0, 4),
      $inc: {
        ratingPlays: 1, //rating management
        footsteprank: footsteprankInc,
        streakCurrent: 1,
        streakToday: streakTodayPlus,
        streakRecord: streakRecordPlus,
        stepsTakenToday: 1,
        stepsTakenLifetime: 1,
        timePlayingToday: req.body.time,
        timePlayingLifetime: req.body.time,
      },
      rating: newUserRating, //rating management
      kfactor, //rating management
      ratingPeak,
    },
    {
      runValidators: true,
    },
  );
};
