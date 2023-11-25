const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

// const calculateEloRating = require('./consoleGamePlayFunctions/calculateEloRating');

exports.wrongAnswer = async (req, gd) => {
  // Find new dictionary word
  // if (Math.random() > 0.5)
  //   dicWord = await getDicWordByRating(gd);
  // else {
  const dicWord = await DicEntry.findOne({
    rank: gd.footsteprank,
    dictionaryName: gd.dictionary,
  });
  // }

  const newDicWord = {
    id: dicWord._id,
    target: dicWord.target,
    solutions: dicWord.solutions,
    rating: dicWord.rating,
  };

  // Updating the userrating will be implemented later
  // const newUserRating = calculateEloRating.winner(gd.rating, gd.dicWord.rating, gd.kfactor);

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
        footsteprank: 1,
        stepsTakenToday: 1,
        stepsTakenLifetime: 1,
        timePlayingToday: req.body.time,
        timePlayingLifetime: req.body.time,
      },
      streakCurrent: 0,
      // rating: newUserRating,
    },
    {
      runValidators: true,
    },
  );
};

exports.correctAnswer = async (req, gd) => {
  // Find new dictionary word
  // if (Math.random() > 0.5)
  //   dicWord = await getDicWordByRating(gd);
  // else {
  const dicWord = await DicEntry.findOne({
    dictionaryName: gd.dictionary,
    rank: gd.footsteprank,
  });
  // }

  const modifiedResult = {
    id: dicWord._id,
    target: dicWord.target,
    solutions: dicWord.solutions,
    rating: dicWord.rating,
  };

  // Updating the userrating will be implemented later
  // const newUserRating = calculateEloRating.winner(gd.rating, gd.dicWord.rating, gd.kfactor);

  const streakTodayPlus =
    gd.streakCurrent >= gd.streakToday ? 1 : 0;

  const streakRecordPlus =
    gd.streakCurrent >= gd.streakRecord ? 1 : 0;

  gd.tail.unshift(gd.dicWord.target);
  // Update GameData with new DicWord and DicPlay
  await GameData.findOneAndUpdate(
    { user: req.user.id },
    {
      dicPlay: true,
      dicWord: modifiedResult,
      tail: gd.tail.slice(0, 4),
      $inc: {
        footsteprank: 1,
        streakCurrent: 1,
        streakToday: streakTodayPlus,
        streakRecord: streakRecordPlus,
        stepsTakenToday: 1,
        stepsTakenLifetime: 1,
        timePlayingToday: req.body.time,
        timePlayingLifetime: req.body.time,
      },
      // rating: newUserRating,
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
    dictionaryName: gd.dictionary,
  });

  if (doc) return doc;
  else {
    const result = await DicEntry.findOne({
      rating: {
        $lte: intervalCenter,
      },
      dictionaryName: gd.dictionary,
    });

    return result;
  }
};
