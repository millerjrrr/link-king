const express = require('express');
const dicEntryController = require('../controllers/dicEntryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, dicEntryController.getAll)
  .post(dicEntryController.createOne);

router
  .route('/:id')
  .get(dicEntryController.getOne)
  .patch(dicEntryController.updateOne)
  .delete(dicEntryController.deleteOne);

module.exports = router;
