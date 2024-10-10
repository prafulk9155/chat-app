const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/group');
const Message = require('./models/Message'); // Import the Message model


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://192.168.1.126:5173", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Use cors middleware for HTTP requests
app.use(cors({
    origin: 'http://192.168.1.126:5173', // Allow your frontend URL to access your backend
    methods: ['GET', 'POST'],
    credentials: true, // Enable credentials
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ error: false, message: "API is working..." });
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (msg) => {
        // Save the message to the database and emit to the recipient
        const newMessage = new Message(msg);
        await newMessage.save(); // Save the message to the DB
        io.to(msg.recipientId).emit('receiveMessage', msg); // Notify the intended recipient
    });

    socket.on('typing', (userId) => {
        socket.broadcast.emit('typing', userId); // Broadcast typing event to other users
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Server startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
