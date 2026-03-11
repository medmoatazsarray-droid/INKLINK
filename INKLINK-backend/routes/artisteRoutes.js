const express = require('express');
const router = express.Router();
const artisteController = require('../controllers/artisteController');

router.get('/', artisteController.getAllArtistes);

module.exports = router;
