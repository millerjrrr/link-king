const GameData = require('../models/gameDataModel');
const {
  selectorTicket,
} = require('../utils/dictionarySelectors');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

exports.correctAnswer = async (req, gd) => {
  const Ticket = selectorTicket(
    req.user.language.dictionary,
  );

  const streakTodayPlus =
    gd.streakCurrent >= gd.streakToday ? 1 : 0;

  const streakRecordPlus =
    gd.streakCurrent >= gd.streakRecord ? 1 : 0;

  // Update if attempt is inside repeats
  if (gd.index < gd.repeats.length) {
    // Update the tail
    if (gd.index === 0) gd.tail = [gd.repeats[0].target];
    else gd.tail.unshift(gd.repeats[gd.index].target);
    // Update dictionary play variable
    const dicPlay =
      gd.dueToday.length === 0 &&
      gd.index + 1 === gd.repeats.length;

    // Update game data
    await GameData.findOneAndUpdate(
      { _id: req.user.gdID },
      {
        dicPlay,
        tail: gd.tail,
        $inc: {
          streakCurrent: 1,
          streakToday: streakTodayPlus,
          streakRecord: streakRecordPlus,
          index: 1,
          stepsTakenToday: 1,
          stepsTakenLifetime: 1,
          timePlayingToday: req.body.time,
          timePlayingLifetime: req.body.time,
        },
      },
      {
        runValidators: true,
      },
    );
  } else if (gd.dueToday.length > 0) {
    // Update the tail
    gd.tail.unshift(gd.dueToday[0].target);
    // Update the ticket database
    const todayNumberStyle = dateToNumberStyleDate(
      Date.now(),
    );
    await Ticket.findOneAndUpdate(
      { _id: gd.dueToday[0].id },
      [
        {
          $set: {
            dueDate: {
              $add: [
                todayNumberStyle,
                {
                  $pow: [2, '$level'],
                  // If we get it right in these circumstances
                  // we don't want to see it again tomorrow
                },
              ],
            },
            level: { $add: ['$level', 1] },
          },
        },
      ],
      {
        runValidators: true,
      },
    );
    // Index stays the same, update dueToday
    gd.dueToday.shift();
    // Update dictionary play variable
    const dicPlay = gd.dueToday.length === 0;
    // Update game data
    await GameData.findOneAndUpdate(
      { _id: req.user.gdID },
      {
        dicPlay,
        dueToday: gd.dueToday,
        tail: gd.tail,
        $inc: {
          streakCurrent: 1,
          streakToday: streakTodayPlus,
          streakRecord: streakRecordPlus,
          stepsTakenToday: 1,
          stepsTakenLifetime: 1,
          timePlayingToday: req.body.time,
          timePlayingLifetime: req.body.time,
        },
      },
      {
        runValidators: true,
      },
    );
  }
};

exports.wrongAnswer = async (req, gd) => {
  const Ticket = selectorTicket(
    req.user.language.dictionary,
  );
  // Update if attempt is inside repeats
  if (gd.index < gd.repeats.length) {
    if (gd.index > 0) {
      // Update the tail
      gd.tail = [gd.repeats[gd.index].solutions[0]];
      // Update repeats
      let newFirst = gd.repeats[gd.index];
      gd.repeats.splice(gd.index, 1);
      gd.repeats.unshift(newFirst);
      // Update the index
    }
    // Update game data
    await GameData.findOneAndUpdate(
      { _id: req.user.gdID },
      {
        index: 0,
        streakCurrent: 0,
        tail: gd.tail,
        repeats: gd.repeats.slice(0, 5),
        $inc: {
          stepsTakenToday: 1,
          stepsTakenLifetime: 1,
          timePlayingToday: req.body.time,
          timePlayingLifetime: req.body.time,
        },
      },
      {
        runValidators: true,
      },
    );
  } else if (gd.dueToday.length > 0) {
    // Update the tail
    gd.tail = gd.dueToday[0].solutions[0];
    // Update the ticket database
    await Ticket.findOneAndUpdate(
      { _id: gd.dueToday[0].id },
      {
        level: 1,
        dueDate: dateToNumberStyleDate(Date.now()) + 1,
      },
      {
        runValidators: true,
      },
    );
    // Update repeats
    gd.repeats.unshift(gd.dueToday[0]);
    gd.repeats = gd.repeats.slice(0, 5);
    // Update dueToday
    gd.dueToday.shift();
    // Update game data
    await GameData.findOneAndUpdate(
      { _id: req.user.gdID },
      {
        index: 0,
        streakCurrent: 0,
        dueToday: gd.dueToday,
        repeats: gd.repeats.slice(0, 5),
        tail: gd.tail,
        $inc: {
          stepsTakenToday: 1,
          stepsTakenLifetime: 1,
          timePlayingToday: req.body.time,
          timePlayingLifetime: req.body.time,
        },
      },
      {
        runValidators: true,
      },
    );
  }
};
