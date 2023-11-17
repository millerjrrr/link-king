const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');
const dicPlay = require('../consoleGamePlayFunctions/dicPlay');
const repPlay = require('../consoleGamePlayFunctions/repPlay');
const sendGameState = require('../consoleGamePlayFunctions/sendGameState');

// When a user signs up we create there default game data
// All users must have one. After sign up it is only ever updated
exports.createOne = catchAsync(async (req, res, next) => {
  const defaultGameData = {
    user: req.user.id,
    dueToday: [],
    repeats: [],
    index: 0,
  };

  const gameData = await GameData.create(defaultGameData);
  res.status(201).json({
    status: 'success',
    data: {
      gameData,
    },
  });
  next();
});

exports.newDayUpdate = catchAsync(
  async (req, res, next) => {
    console.log(req.user.id);
    const userGameData = await GameData.findOne({
      user: req.user.id,
    });

    if (!userGameData)
      return next(
        new AppError(
          'No game data found for this user',
          404,
        ),
      );

    let doc;
    if (
      userGameData.lastPlayed <
      dateToNumberStyleDate(Date.now())
    ) {
      const filter = {
        user: req.user.id,
        dueDate: {
          $lte: dateToNumberStyleDate(Date.now()),
        },
      };

      const dueToday = await Ticket.find(filter)
        .populate({
          path: 'dicEntry',
          select: 'target solutions',
        })
        .sort('level')
        .lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

      // Modify the structure of the retrieved documents
      const modifiedResults = dueToday.map((ticket) => ({
        id: ticket._id,
        target: ticket.dicEntry.target,
        solutions: ticket.dicEntry.solutions,
        level: ticket.level,
      }));

      console.log(modifiedResults);

      doc = await GameData.findOneAndUpdate(
        { user: req.user.id },
        {
          dueToday: modifiedResults,
          repeats: [],
          index: 0,
          lastPlayed: dateToNumberStyleDate(Date.now()),
        },
        {
          runValidators: true,
        },
      );

      res.status(200).json({
        status: 'success',
        data: {
          dueToday: dueToday.length,
        },
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: 'Already up to date!',
      });
    }
    next();
  },
);

// Soon, add an AttemptHandler to deal with attempts using
// the 4 play functions

// Then we combine all 4 options into one handler here in this document

exports.attemptHandler = catchAsync(
  async (req, res, next) => {
    const gd = await GameData.findOne({
      user: req.user.id,
    });

    // Correct answer + Dictionary Play
    if (req.body.correct && gd.dicPlay)
      await dicPlay.correctAnswer(req.user.id, gd);
    // Wrong Answer + Dictionary Play
    if (!req.body.correct && gd.dicPlay)
      await dicPlay.wrongAnswer(req.user.id, gd);
    // Correct answer + repPlay
    if (req.body.correct && !gd.dicPlay)
      await repPlay.correctAnswer(req.user.id, gd);
    // Wrong answer + repPlay
    if (!req.body.correct && !gd.dicPlay)
      await repPlay.wrongAnswer(req.user.id, gd);
    next();
  },
);
