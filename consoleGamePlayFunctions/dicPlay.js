const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

// const calculateEloRating = require('./consoleGamePlayFunctions/calculateEloRating');

exports.wrongAnswer = async (userId, gd) => {
  // Find new dictionary word
  const dicWord = await DicEntry.findOne({
    // rating: {
    //   $gte:
    //     gd.rating + Math.random() * 50 - 100,
    //   $lte:
    //     gd.rating + 50 + Math.random() * 150,
    // },
    // An alternative way to get random result based on rank
    rank: Math.round(Math.random() * 200),
  });

  console.log('made it this far');
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
      user: userId,
      dicEntry: gd.dicWord.id,
    },
    {
      level: 1,
      dueData: dateToNumberStyleDate(Date.now()),
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
    { user: userId },
    {
      index: 0,
      repeats: gd.repeats.slice(0, 5),
      dicPlay: false,
      dicWord: newDicWord,
      tail: [gd.dicWord.solutions[0]],
      // rating: newUserRating,
    },
    {
      runValidators: true,
    },
  );
};

exports.correctAnswer = async (userId, gd) => {
  // Find new dictionary word
  const dicWord = await DicEntry.findOne({
    // rating: {
    //   $gte:
    //     gd.rating + Math.random() * 50 - 100,
    //   $lte:
    //     gd.rating + 50 + Math.random() * 150,
    // },
    // An alternative way to get random result based on rank
    rank: Math.round(Math.random() * 200),
  });

  const modifiedResult = {
    id: dicWord._id,
    target: dicWord.target,
    solutions: dicWord.solutions,
    rating: dicWord.rating,
  };

  // Updating the userrating will be implemented later
  // const newUserRating = calculateEloRating.winner(gd.rating, gd.dicWord.rating, gd.kfactor);

  gd.tail.unshift(gd.dicWord.target);
  // Update GameData with new DicWord and DicPlay
  const doc = await GameData.findOneAndUpdate(
    { user: userId },
    {
      dicPlay: true,
      dicWord: modifiedResult,
      tail: gd.tail.slice(0, 4),
      // rating: newUserRating,
    },
    {
      runValidators: true,
    },
  );
};
