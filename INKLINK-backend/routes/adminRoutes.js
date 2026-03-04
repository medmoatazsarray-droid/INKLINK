const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
router.post('/login', adminController.login);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/verify-reset-token', adminController.verifyResetToken);
router.post('/reset-password', adminController.resetPassword);
module.exports = router;
