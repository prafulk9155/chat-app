const express = require('express');
const { getMessages, createMessage } = require('../controllers/messageController');

const router = express.Router();

// Route to get all messages
router.get('/', getMessages);

// Route to create a new message
router.post('/', createMessage);

module.exports = router;
