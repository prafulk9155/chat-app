const Message = require('../models/Message');

// Controller to get all messages for a specific user
const getMessages = async (req, res) => {
    const { userId, recipientId } = req.params; // Get user IDs from the request parameters
    try {
        // Fetch messages between two users
        const messages = await Message.find({
            $or: [
                { userId, recipientId },
                { userId: recipientId, recipientId: userId }
            ]
        }).sort({ createdAt: -1 }); // Sort messages by creation date, newest first
        
        res.json(messages); // Return the messages as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); // Handle errors
    }
};

// Controller to create a new message
const createMessage = async (req, res) => {
    const { content, userId, recipientId } = req.body; // Get data from the request body

    if (!content || !userId || !recipientId) {
        return res.status(400).json({ msg: 'Message content, userId and recipientId are required.' });
    }

    try {
        const newMessage = new Message({
            content,
            userId,
            recipientId,
        });
        
        await newMessage.save(); // Save the new message without setting _id manually
        res.status(201).json(newMessage); // Return the newly created message
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); // Handle any other errors
    }
};

// Controller to mark a message as read
const markAsRead = async (req, res) => {
    const { messageId } = req.params; // Get the message ID from request parameters
    const userId = req.body.userId; // Get the user ID from the request body

    try {
        const message = await Message.findById(messageId); // Find the message by ID
        if (!message) return res.status(404).send('Message not found'); // Handle case where message does not exist

        // Add user ID to the readBy array if not already present
        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId); // Update the readBy array
            await message.save(); // Save the updated message
        }

        res.status(200).send('Message marked as read'); // Success response
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); // Handle errors
    }
};

module.exports = {
    getMessages,
    createMessage,
    markAsRead
};
