const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const GameData = require('../models/gameDataModel');
const {
  DicEntryPersonal,
  DicEntryBrazil,
} = require('../models/dicEntryModel');
const {
  TicketPersonal,
  TicketBrazil,
} = require('../models/ticketModel');

exports.homePage = (req, res) => {
  res.status(200).render('homepage');
};

exports.statistics = catchAsync(async (req, res) => {
  let Ticket;
  if (req.user.language.dictionary === 'Personal') {
    Ticket = TicketPersonal;
  } else {
    Ticket = TicketBrazil;
  }

  const usergamedata = await GameData.findOne({
    _id: req.user.gdID,
  }).select(
    '-_id -user -kfactor -repeats -index -tail -dicPlay -dicWord -lastPlayed -dictionary -footsteprank -__v',
  );

  const levelbreakdown = await Ticket.aggregate([
    {
      $match: {
        userGDProfile: req.user.gdID,
      },
    },
    {
      $group: {
        _id: '$level',
        frequency: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        level: '$_id',
        frequency: 1,
      },
    },
    {
      $sort: { level: 1 },
    },
  ]);

  const wordscollected = await Ticket.countDocuments({
    userGDProfile: req.user.gdID,
  });

  res.status(200).render('statistics', {
    title: 'Statistics',
    usergamedata,
    levelbreakdown,
    wordscollected,
  });
});

exports.console = catchAsync(async (req, res) => {
  res.status(200).render('homepage');
});

exports.dictionary = catchAsync(async (req, res) => {
  let DicEntry; //Ticket not required
  if (req.user.language.dictionary === 'Personal') {
    DicEntry = DicEntryPersonal;
  } else {
    DicEntry = DicEntryBrazil;
  }

  const features = new APIFeatures(
    DicEntry.find(),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const results = await features.query;

  res.status(200).render('dictionary', {
    title: 'Dictionary',
    results,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getPasswordResetPage = (req, res) => {
  res.status(200).render('resetpass', {
    title: 'Reset Password',
    email: req.query.email,
  });
};

exports.getForgotPasswordPage = (req, res) => {
  res.status(200).render('forgotpass', {
    title: 'Forgot Password',
  });
};
