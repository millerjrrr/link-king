const express = require('express');
const gameDataController = require('../controllers/gameDataController');
const authController = require('../controllers/authController');
const updateConsole = require('../consoleGamePlayFunctions/updateConsole');

const router = express.Router();

router.post(
  '/sendGameState',
  authController.protect,
  updateConsole.sendGameState,
);

router.post(
  '/submitAttempt',
  authController.protect,
  gameDataController.attemptHandler,
  updateConsole.sendGameState,
);

router.post(
  '/updateGameSettings',
  authController.protect,
  gameDataController.updateGameSettings,
);

module.exports = router;
