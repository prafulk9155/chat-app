const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true,
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId, // ID of the user receiving the message
        ref: 'User',
        required: true,
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId, // Array of user IDs who have read the message
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
