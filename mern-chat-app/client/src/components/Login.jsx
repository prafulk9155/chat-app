import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.1.126:5000/api/users/login', {
                username,
                password
            });
            // Store the user ID in local storage
            localStorage.setItem('userId', response.data.userId); // Ensure you have the userId in your response
            navigate('/users'); // Redirect to user list after successful login
        } catch (error) {
            console.error('Error logging in:', error);
            alert("Login failed: " + (error.response.data || "Invalid credentials!"));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl mb-4">Login</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="border p-2 mb-4 w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="border p-2 mb-4 w-full"
                />
                <button className="bg-blue-600 text-white p-2 rounded">Login</button>
                <div className="mt-4">
                    Don't have an account? <a href="/signup">Sign up here</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
