// Used for the dictionary tab - IMPORTANT

const mongoose = require('mongoose');
const GameData = require('../models/gameDataModel');
const {
  selectorDicEntry,
  selectorTicket,
} = require('../utils/dictionarySelectors');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

exports.createOne = catchAsync(async (req, res) => {
  const DicEntry = selectorDicEntry(
    req.user.language.dictionary,
  );
  const Ticket = selectorTicket(
    req.user.language.dictionary,
  );

  const dicWord = await DicEntry.findOne({
    target: req.body.target,
  });

  // Updating the userrating will be implemented later
  // const newUserRating = calculateEloRating.winner(gd.rating, gd.dicWord.rating, gd.kfactor);

  const ticket = await Ticket.findOneAndUpdate(
    {
      userGDProfile: req.user.gdID,
      dicEntry: dicWord.id,
    },
    {
      level: 1,
      dueDate: dateToNumberStyleDate(Date.now()),
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
  const dueTodayPush = {
    id: ticket._id,
    target: ticket.dicEntry.target,
    solutions: ticket.dicEntry.solutions,
    level: ticket.level,
  };

  await GameData.findOneAndUpdate(
    { _id: req.user.gdID },
    { $addToSet: { dueToday: dueTodayPush } },
    { new: true, upsert: true },
  )
    .then(() => {
      res.status(200).json({
        status: 'success',
      });
    })
    .catch((error) => {
      res.status(200).json({
        status: 'error',
      });
    });
});

exports.levelTotals = catchAsync(async (req, res) => {
  const Ticket = selectorTicket(
    req.user.language.dictionary,
  );

  const usergdID = new mongoose.Types.ObjectId(
    req.user.gdID,
  );

  const results = await Ticket.aggregate([
    {
      $match: {
        userGDProfile: usergdID,
      }, // Filter the documents based on the criteria
    },
    {
      $group: {
        _id: '$level',
        frequency: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        level: '$_id',
        frequency: 1,
      },
    },
    {
      $sort: { level: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results,
  });
});
