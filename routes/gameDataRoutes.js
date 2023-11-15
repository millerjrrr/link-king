const express = require('express');
const gameDataController = require('../controllers/gameDataController');
const authController = require('../controllers/authController');

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

module.exports = router;
