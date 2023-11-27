const express = require('express');
const gameDataController = require('../controllers/gameDataController');
const authController = require('../controllers/authController');
const sendGameState = require('../consoleGamePlayFunctions/sendGameState');

const router = express.Router();

router.post(
  '/sendGameState',
  authController.protect,
  sendGameState,
);

router.post(
  '/submitAttempt',
  authController.protect,
  gameDataController.attemptHandler,
  sendGameState,
);

router.post(
  '/updateGameSettings',
  authController.protect,
  gameDataController.updateGameSettings,
);

module.exports = router;
