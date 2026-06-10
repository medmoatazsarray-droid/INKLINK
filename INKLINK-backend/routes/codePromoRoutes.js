const express = require('express');
const router = express.Router();
const { getActivePromo } = require('../controllers/codePromoController');

router.get('/codepromo/active', getActivePromo);
router.get('/codePromo/active', getActivePromo);

module.exports = router;
