const GameData = require('../models/gameDataModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  const userGameData = await GameData.findOne({
    user: req.user.id,
  });

  if (!userGameData)
    return next(
      new AppError('No game data found for this user', 404),
    );

  const queue = userGameData.repeats
    .concat(userGameData.dueToday)
    .concat(userGameData.dicWord)
    .slice(userGameData.index, userGameData.index + 10);

  while (queue.length < 10) queue.push({ target: '   ' });

  const attempt = queue[0];
  const raceTrack = queue.slice(1).map((row) => row.target);

  res.status(200).json({
    status: 'success',
    data: {
      attempt,
      raceTrack,
      tail: userGameData.tail,
    },
  });
});
