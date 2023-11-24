const DicEntry = require('../models/dicEntryModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.homePage = (req, res) => {
  res.status(200).render('homepage');
};

exports.statistics = (req, res) => {
  res.status(200).render('statistics', {
    title: 'Statistics',
  });
};
exports.console = (req, res) => {
  res.status(200).render('console', {
    title: 'Console',
  });
};
exports.dictionary = catchAsync(async (req, res) => {
  // const results = await DicEntry.find();
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
