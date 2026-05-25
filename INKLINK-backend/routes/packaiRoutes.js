const express = require('express');
const router = express.Router();
const packaiController = require('../controllers/packaiController');

router.get('/search', packaiController.getPack);

module.exports = router;
