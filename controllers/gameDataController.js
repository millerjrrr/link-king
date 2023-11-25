const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const dicPlay = require('../consoleGamePlayFunctions/dicPlay');
const repPlay = require('../consoleGamePlayFunctions/repPlay');
const sendGameState = require('../consoleGamePlayFunctions/sendGameState');

exports.attemptHandler = catchAsync(
  async (req, res, next) => {
    const gd = await GameData.findOne({
      user: req.user.id,
    });

    // Correct answer + Dictionary Play
    if (req.body.correct && gd.dicPlay)
      await dicPlay.correctAnswer(req, gd);
    // Wrong Answer + Dictionary Play
    if (!req.body.correct && gd.dicPlay)
      await dicPlay.wrongAnswer(req, gd);
    // Correct answer + repPlay
    if (req.body.correct && !gd.dicPlay)
      await repPlay.correctAnswer(req, gd);
    // Wrong answer + repPlay
    if (!req.body.correct && !gd.dicPlay)
      await repPlay.wrongAnswer(req, gd);
    next();
  },
);
