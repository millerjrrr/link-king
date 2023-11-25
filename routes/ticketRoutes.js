const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router
  .route('/')
  // .get(authController.protect, dicEntryController.getAll)
  .post(authController.protect, ticketController.createOne);

router
  .route('/statistics')
  .get(
    authController.protect,
    ticketController.levelTotals,
  );
//   .patch(ticketController.updateOne)
//   .delete(ticketController.deleteOne);

module.exports = router;
