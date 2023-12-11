const jStat = require('jstat');
const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');
const calculateEloRating = require('./calculateEloRating');

exports.wrongAnswer = async (req, gd) => {
  const newUserRating = calculateEloRating.loser(
    gd.dicWord.rating,
    gd.rating,
    gd.kfactor,
  ); //rating management
  const kfactor = gd.kfactor === 20 ? 20 : gd.kfactor - 1; //rating management

  // New DicWord by Rating
  const dictionarySize = 3173; //NEEDS TO BE MAINTAINED
  let lookUpRank = Math.floor(
    jStat.normal.cdf(newUserRating, 1200, 400) *
      dictionarySize -
      50 +
      Math.random() * 100,
  );
  lookUpRank = lookUpRank < 0 ? 0 : lookUpRank;
  lookUpRank =
    lookUpRank > dictionarySize
      ? dictionarySize
      : lookUpRank;

  // //Linear progression mode
  // lookUpRank = gd.footsteprank;

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
      user: req.user.id,
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
    path: 'dicEntry',
    select: 'target solutions',
  });

  // Modify the structure of the retrieved documents
  const newRepeat = {
    id: ticket._id,
    target: ticket.dicEntry.target,
    solutions: ticket.dicEntry.solutions,
    level: ticket.level,
  };

  gd.repeats.unshift(newRepeat);
  // Update GameData with new DicWord and DicPlay
  const doc = await GameData.findOneAndUpdate(
    { user: req.user.id },
    {
      index: 0,
      repeats: gd.repeats.slice(0, 5),
      dicPlay: false,
      dicWord: newDicWord,
      tail: [gd.dicWord.solutions[0]],
      $inc: {
        ratingPlays: 1, //rating management
        footsteprank: 1,
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
  const newUserRating = calculateEloRating.winner(
    gd.rating,
    gd.dicWord.rating,
    gd.kfactor,
  ); //rating management
  const kfactor = gd.kfactor === 20 ? 20 : gd.kfactor - 1; //rating management

  // New DicWord by Rating
  const dictionarySize = 3173; //NEEDS TO BE MAINTAINED
  let lookUpRank = Math.floor(
    jStat.normal.cdf(newUserRating, 1200, 400) *
      dictionarySize -
      50 +
      Math.random() * 100,
  );
  lookUpRank = lookUpRank < 0 ? 0 : lookUpRank;
  lookUpRank =
    lookUpRank > dictionarySize
      ? dictionarySize
      : lookUpRank;

  // //Linear progression mode NO LONGER WORKS DUE TO REORDERING
  // //
  // lookUpRank = gd.footsteprank;

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

  gd.tail.unshift(gd.dicWord.target);
  // Update GameData with new DicWord and DicPlay
  await GameData.findOneAndUpdate(
    { user: req.user.id },
    {
      dicPlay: true,
      dicWord: modifiedResult,
      tail: gd.tail.slice(0, 4),
      $inc: {
        ratingPlays: 1, //rating management
        footsteprank: 1,
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

const getDicWordByRating = async (gd) => {
  const intervalCenter =
    gd.rating - 50 + Math.random() * 100;

  const doc = await DicEntry.findOne({
    rating: {
      $gte: intervalCenter,
    },
  });

  if (doc) return doc;
  else {
    const result = await DicEntry.findOne({
      rating: {
        $lte: intervalCenter,
      },
    });

    return result;
  }
};
