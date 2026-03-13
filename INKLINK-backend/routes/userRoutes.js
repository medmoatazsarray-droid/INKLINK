const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Profile routes
router.get('/profile/:id', userController.getProfile);
router.put('/profile/:id', userController.updateProfile);

// Orders route
router.get('/orders/:id', userController.getOrders);

module.exports = router;
