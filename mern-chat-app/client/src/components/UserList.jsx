import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId'); // Assuming userId is stored after login

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://192.168.1.126:5000/api/users?currentUserId=${currentUserId}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`); // Navigate to the chat with that user
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            <h2 className="text-xl mb-4">Available Users</h2>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 mb-4 w-full"
            />
            <div className="flex-grow overflow-auto bg-white border border-gray-300 rounded-lg p-4">
                {filteredUsers.map((user) => (
                    <div 
                        key={user._id} 
                        onClick={() => handleUserClick(user._id)} // Click to chat with selected user
                        className="p-2 border-b cursor-pointer hover:bg-gray-200"
                    >
                        {user.username}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
