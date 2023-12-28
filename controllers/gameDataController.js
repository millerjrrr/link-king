const GameData = require('../models/gameDataModel');
const catchAsync = require('../utils/catchAsync');
const dicPlay = require('../consoleGamePlayFunctions/dicPlay');
const repPlay = require('../consoleGamePlayFunctions/repPlay');

exports.attemptHandler = catchAsync(
  async (req, res, next) => {
    const gd = await GameData.findOne({
      _id: req.user.gdID,
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

exports.updateGameSettings = catchAsync(
  async (req, res, next) => {
    await GameData.findOneAndUpdate(
      {
        _id: req.user.gdID,
      },
      {
        sound: req.body.sound,
        blurred: req.body.blurred,
        timer: req.body.timer,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      status: 'success',
    });
  },
);
