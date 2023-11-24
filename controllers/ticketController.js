const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

exports.createOne = catchAsync(async (req, res, next) => {
  const dicWord = await DicEntry.findOne({
    target: req.body.target,
  });

  // Updating the userrating will be implemented later
  // const newUserRating = calculateEloRating.winner(gd.rating, gd.dicWord.rating, gd.kfactor);
  const userId = req.user.id;

  const ticket = await Ticket.findOneAndUpdate(
    {
      user: userId,
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

  // Update GameData with new DicWord and DicPlay
  await GameData.findOneAndUpdate(
    { user: userId },
    {
      $push: { dueToday: dueTodayPush },
    },
    {
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
  });

  // next();
});
