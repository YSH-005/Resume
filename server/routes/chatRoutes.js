const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getChats, getMessages, sendMessage } = require('../controllers/chatController');

router.get('/', protect, getChats);
router.get('/:chatId/messages', protect, getMessages);
router.post('/message', protect, sendMessage);

module.exports = router;
