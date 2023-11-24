const express = require('express');
// const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// For every route, we want to check if the user is logged in or not!
router.use(authController.isLoggedIn);

router.get('/', viewsController.homePage);

router.get('/statistics', viewsController.statistics);
router.get(
  '/console',
  authController.protect,
  viewsController.console,
);

router.get('/dictionary', viewsController.dictionary);

router.get('/login', viewsController.getLoginForm);
router.get('/signUp', viewsController.getSignUpForm);

module.exports = router;
