const GameData = require('../models/gameDataModel');
const {
  selectorTicket,
} = require('../utils/dictionarySelectors');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

exports.sendGameState = catchAsync(async (req, res) => {
  const data = await updateGDAndReturnData(req.user);

  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.loadConsolePage = catchAsync(async (req, res) => {
  let data = await updateGDAndReturnData(req.user);
  res.status(200).render('console', {
    title: 'Console',
    data,
  });
});

const newDayUpdate = async (user) => {
  const Ticket = selectorTicket(
    req.user.language.dictionary,
  );

  const filter = {
    userGDProfile: user.gdID,
    dueDate: {
      $lte: dateToNumberStyleDate(Date.now()),
    },
  };

  const collectedWordsDayStart =
    await Ticket.countDocuments({
      userGDProfile: user.gdID,
    });

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
    { _id: user.gdID },
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

const updateGDAndReturnData = async (user) => {
  let gd = await GameData.findOne({
    _id: user.gdID,
  });

  if (!gd)
    return next(
      new AppError('No game data found for this user', 404),
    );

  if (gd.lastPlayed < dateToNumberStyleDate(Date.now()))
    gd = await newDayUpdate(user);

  const queue = gd.repeats
    .concat(gd.dueToday)
    .concat(gd.dicWord)
    .slice(gd.index, gd.index + 20);

  while (queue.length < 20)
    queue.push({ target: '????????' });

  let attempt = queue[0];
  const raceTrack = queue.map((row) => row.target);
  const tries = gd.index < gd.repeats.length ? 1 : 3;
  if (attempt.level && gd.index < gd.repeats.length)
    attempt.level = 0;

  return {
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
  };
};
