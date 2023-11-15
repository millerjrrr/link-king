const GameData = require('../models/gameDataModel');
const Ticket = require('../models/ticketModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');
// const APIFeatures = require('../utils/apiFeatures');
// const APIFeatures = require('../utils/apiFeatures');
// const factory = require('./handlerFactory');

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
          $lte: dateToNumberStyleDate(Date.now()) + 1,
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
          dueToday: doc.dueToday.length,
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

exports.sendGameState = catchAsync(
  async (req, res, next) => {
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

    let queue = userGameData.repeats
      .concat(userGameData.dueToday)
      .slice(userGameData.index, userGameData.index + 10);

    const attempt = queue[0];
    while(queue.length<10) queue.push({target: '???????'})
    const raceTrack = queue.slice(1,10).map(row => row.target);
    const tail = [];
    for( let i = 0)


    res.status(200).json({
      status: 'success',
      data: {
        attempt,
        raceTrack,

      },
    });
    next();
  },
);
