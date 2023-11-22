// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

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
exports.contact = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact',
  });
};

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
