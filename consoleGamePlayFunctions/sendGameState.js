const GameData = require('../models/gameDataModel');
const Ticket = require('../models/ticketModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

module.exports = catchAsync(async (req, res, next) => {
  let gd = await GameData.findOne({
    user: req.user.id,
  });

  if (!gd)
    return next(
      new AppError('No game data found for this user', 404),
    );

  if (gd.lastPlayed < dateToNumberStyleDate(Date.now()))
    gd = await newDayUpdate(req.user.id);
  const queue = gd.repeats
    .concat(gd.dueToday)
    .concat(gd.dicWord)
    .slice(gd.index, gd.index + 10);

  while (queue.length < 10)
    queue.push({ target: '????????' });

  const attempt = queue[0];
  const raceTrack = queue.slice(1).map((row) => row.target);
  const tries = gd.index < gd.repeats.length ? 1 : 3;

  res.status(200).json({
    status: 'success',
    data: {
      attempt,
      raceTrack,
      tail: gd.tail,
      tries,
      sound: gd.sound,
      timer: gd.timer,
      blurred: gd.blurred,
      stats: {
        due: gd.dueToday.length,
        steps: gd.stepsTakenToday,
        time: gd.timePlayingToday,
      },
    },
  });
});

const newDayUpdate = async (user) => {
  const filter = {
    user,
    dueDate: {
      $lte: dateToNumberStyleDate(Date.now()),
    },
  };
  console.log(filter);

  const collectedWordsDayStart =
    await Ticket.countDocuments({ user });

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

  const gd = await GameData.findOneAndUpdate(
    { user },
    {
      dueToday: modifiedResults,
      repeats: [],
      index: 0,
      timePlayingToday: 0,
      stepsTakenToday: 0,
      paceToday: 0,
      streakToday: 0,
      streakCurrent: 0,
      lastPlayed: dateToNumberStyleDate(Date.now()),
      tail: [],
      dicPlay: false,
      collectedWordsDayStart,
    },
    {
      runValidators: true,
      new: true,
    },
  );

  return gd;
};
