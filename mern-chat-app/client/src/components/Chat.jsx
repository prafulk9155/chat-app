import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Initialize the socket connection to your server
const socket = io('http://192.168.1.126:5000'); // Adjust if running on a different server port

const Chat = () => {
    const { userId } = useParams(); // Get the user ID to chat with from URL
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');

    const currentUserId = localStorage.getItem('userId'); // Assuming userId is stored after login

    useEffect(() => {
        // Only call fetchMessages if currentUserId is valid
        if (currentUserId) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.126:5000/api/messages/${currentUserId}/${userId}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
    
            fetchMessages();
        } else {
            console.error('Current user ID is null'); // Log this issue if ID is null
        }
    }, [userId]);
    useEffect(() => {
        // Fetch messages specific to the selected user
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://192.168.1.126:5000/api/messages/${currentUserId}/${userId}`);
                setMessages(response.data); // Assuming messages are returned
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages(); // Fetch messages when the component mounts

        // Listen for incoming messages
        socket.on('receiveMessage', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
            sendNotification(msg.content); // Notify user of new message
        });

        // Typing event listener
        socket.on('typing', (userId) => {
            setIsTyping(true);
            setTypingUser(userId);
            setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
        };
    }, [userId, currentUserId]);

    const handleKeyPress = () => {
        // Emit typing event when the user is typing
        socket.emit('typing', currentUserId);
    };

    const sendMessage = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (message.trim()) {
            try {
                // Check that currentUserId and userId are valid and not null
                const response = await axios.post('http://192.168.1.126:5000/api/messages', {
                    content: message,
                    userId: currentUserId,  // Ensure this is the logged-in user ID
                    recipientId: userId, // Correct user ID of the recipient
                });
                socket.emit('sendMessage', response.data); // Emit the message to the socket
                setMessage(''); // Clear the input field
            } catch (error) {
                console.error('Error sending message:', error); // Log the error
            }
        }
    };
    

    const sendNotification = (message) => {
        if (Notification.permission === 'granted') {
            new Notification("New Message", {
                body: message,
            });
        }
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            <div className="flex-grow overflow-auto bg-white border border-gray-300 rounded-lg p-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 border-b border-gray-200 ${msg.userId === currentUserId ? "text-right" : "text-left"}`}>
                        <strong>{msg.userId === currentUserId ? "Me" : msg.senderUsername}:</strong> {msg.content}
                    </div>
                ))}
                {isTyping && <div className="p-2 text-gray-500">{typingUser} is typing...</div>} {/* Typing indicator */}
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleKeyPress(); // Emit typing event
                    }}
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
