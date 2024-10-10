const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    members: [String], // List of user IDs for group members
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] // References to messages
});

module.exports = mongoose.model('Group', groupSchema);
