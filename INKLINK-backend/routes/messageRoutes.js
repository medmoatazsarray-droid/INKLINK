const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/artist/:artistId', messageController.getMessagesByArtist);
router.post('/', messageController.createMessage);
router.put('/artist/:artistId/read', messageController.markMessagesAsRead);

module.exports = router;
