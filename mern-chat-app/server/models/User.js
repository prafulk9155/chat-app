const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures that each user has a unique username
    },
    password: {
        type: String,
        required: true, // Password should always be provided
    },
    profilePicture: {
        type: String,
        default: '', // Optional URL for the user's profile picture
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the timestamp when user is created
    },
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in other parts of the application
module.exports = User;
