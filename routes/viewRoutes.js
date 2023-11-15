const express = require('express');
// const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.homePage);

router.get('/statistics', viewsController.statistics);
router.get('/console', viewsController.console);
router.get('/contact', viewsController.contact);

module.exports = router;
