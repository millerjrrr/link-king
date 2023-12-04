const express = require('express');
const freeTestController = require('../controllers/freeTestController');

const router = express.Router();

router.post('/freeTestPlay', freeTestController.nextWord);

module.exports = router;
