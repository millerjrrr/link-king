const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  // .get(authController.protect, dicEntryController.getAll)
  .post(authController.protect, ticketController.createOne);

// router
//   .route('/:id')
//   .get(ticketController.getOne)
//   .patch(ticketController.updateOne)
//   .delete(ticketController.deleteOne);

module.exports = router;
