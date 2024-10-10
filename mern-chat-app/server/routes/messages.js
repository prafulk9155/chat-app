const express = require('express');
const { getMessages, createMessage, markAsRead } = require('../controllers/messageController');

const router = express.Router();

// Route to get messages between two users
router.get('/:currentUserId/:recipientId', getMessages); // this will return messages for the chat

// Route to create a new message
router.post('/', createMessage);

// Route to mark a message as read
router.put('/:id/read', markAsRead);

module.exports = router;
