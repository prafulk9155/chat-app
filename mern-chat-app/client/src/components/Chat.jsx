import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Initialize the socket connection to your server
const socket = io('http://localhost:5000'); // Adjust if running on a different server port

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Fetch messages from the server on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/messages');
                setMessages(response.data.map(msg => msg.content)); // Assuming 'content' is the field name
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Listen for incoming messages via socket
        socket.on('receiveMessage', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        // Cleanup listener when component unmounts
        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    // Send message function
    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim()) {
            try {
                // Send message to the server via POST request
                await axios.post('http://localhost:5000/api/messages', { content: message });
                socket.emit('sendMessage', message); // Emit the message using the socket
                setMessage(''); // Clear the input field
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            <div className="flex-grow overflow-auto bg-white border border-gray-300 rounded-lg p-4">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 border-b border-gray-200">
                        {msg}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg"
                />
                <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
