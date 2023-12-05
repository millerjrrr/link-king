const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router
  .route('/')
  .post(authController.protect, ticketController.createOne);

router
  .route('/statistics')
  .get(
    authController.protect,
    ticketController.levelTotals,
  );

module.exports = router;
