const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Message = require('./models/Message');
const messagesRouter = require('./routes/messages'); // Import routes

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Use the messages routes
app.use('/api/messages', messagesRouter);

app.get('/',(req,res)=>{
    res.status(200).json({error:false, message:"Api is working..."})
})

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (messageContent) => {
        const newMessage = new Message({ content: messageContent });
        try {
            await newMessage.save();
            io.emit('receiveMessage', messageContent);
        } catch (error) {
            console.log('Message saving error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
