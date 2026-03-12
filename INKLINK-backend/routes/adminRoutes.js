const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
try {
    fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
    console.error('Failed to create uploads directory:', err.message);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/login', adminController.login);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/verify-reset-token', adminController.verifyResetToken);
router.post('/reset-password', adminController.resetPassword);
router.put('/update', upload.single('profileImage'), adminController.updateProfile);
router.get('/profile', adminController.getProfile);

module.exports = router;
