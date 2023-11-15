// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.homePage = (req, res) => {
  res.status(200).render('homepage');
};

exports.statistics = (req, res) => {
  res.status(200).render('statistics');
};
exports.console = (req, res) => {
  res.status(200).render('console');
};
exports.contact = (req, res) => {
  res.status(200).render('contact');
};
