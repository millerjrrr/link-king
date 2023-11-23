const GameData = require('../models/gameDataModel');
const DicEntry = require('../models/dicEntryModel');
const Ticket = require('../models/ticketModel');
const catchAsync = require('../utils/catchAsync');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

// const calculateEloRating = require('./consoleGamePlayFunctions/calculateEloRating');

exports.correctAnswer = async (userId, gd) => {
  // Update if attempt is inside repeats
  if (gd.index < gd.repeats.length) {
    // Update the tail
    if (gd.index === 0) gd.tail = [gd.repeats[0].target];
    else gd.tail.unshift(gd.repeats[gd.index].target);
    // Update the index
    gd.index += 1;
    // Update dictionary play variable
    const dicPlay =
      gd.dueToday.length === 0 &&
      gd.index === gd.repeats.length;

    // Update game data
    const doc = await GameData.findOneAndUpdate(
      { user: userId },
      {
        index: gd.index,
        dicPlay,
        tail: gd.tail,
      },
      {
        runValidators: true,
      },
    );
  } else if (gd.dueToday.length > 0) {
    // Update the tail
    gd.tail.unshift(gd.dueToday[0].target);
    // Update the ticket database
    await Ticket.findOneAndUpdate(
      { _id: gd.dueToday[0].id },
      [
        {
          $set: {
            dueDate: {
              $add: [
                '$dueDate',
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
      { user: userId },
      {
        dicPlay,
        dueToday: gd.dueToday,
        tail: gd.tail,
      },
      {
        runValidators: true,
      },
    );
  }
};

exports.wrongAnswer = async (userId, gd) => {
  // Update if attempt is inside repeats
  if (gd.index < gd.repeats.length) {
    if (gd.index > 0) {
      // Update the tail
      gd.tail = [gd.repeats[gd.index].solutions[0]];
      console.log(gd.tail);
      // Update repeats
      let newFirst = gd.repeats[gd.index];
      gd.repeats.splice(gd.index, 1);
      gd.repeats.unshift(newFirst);
      // Update the index
    }
    // Update game data
    const doc = await GameData.findOneAndUpdate(
      { user: userId },
      {
        index: 0,
        tail: gd.tail,
        repeats: gd.repeats.slice(0, 5),
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
      { user: userId },
      {
        index: 0,
        dueToday: gd.dueToday,
        repeats: gd.repeats.slice(0, 5),
        tail: gd.tail,
      },
      {
        runValidators: true,
      },
    );
  }
};
