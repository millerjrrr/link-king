const express = require('express');
const dicEntryController = require('../controllers/dicEntryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, dicEntryController.getAll);

module.exports = router;
