const express = require('express');
const dicEntryController = require('../controllers/dicEntryController');

const router = express.Router();

router
  .route('/')
  .get(dicEntryController.getAll)
  .post(dicEntryController.createOne);

router
  .route('/:id')
  .get(dicEntryController.getOne)
  .patch(dicEntryController.updateOne)
  .delete(dicEntryController.deleteOne);

module.exports = router;

console.log('console');
