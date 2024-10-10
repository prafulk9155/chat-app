const Message = require('../models/Message');

// Controller to get all messages
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Controller to create a new message
const createMessage = async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ msg: 'Message content is required' });
    }
    
    try {
        const newMessage = new Message({ content });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getMessages,
    createMessage,
};
