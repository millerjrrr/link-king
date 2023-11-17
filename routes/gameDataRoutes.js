const express = require('express');
const gameDataController = require('../controllers/gameDataController');
const authController = require('../controllers/authController');
const sendGameState = require('../consoleGamePlayFunctions/sendGameState');

const router = express.Router();

router.post(
  '/create',
  authController.protect,
  gameDataController.createOne,
);

router.post(
  '/newDayUpdate',
  authController.protect,
  gameDataController.newDayUpdate,
);

router.post(
  '/sendGameState',
  authController.protect,
  gameDataController.attemptHandler,
  sendGameState,
);

module.exports = router;
