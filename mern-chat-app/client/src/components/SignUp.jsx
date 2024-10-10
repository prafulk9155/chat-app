import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://192.168.1.126:5000/api/users/register', {
                username,
                password
            });
            // Redirect to login after successful signup
            navigate('/');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSignUp} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl mb-4">Sign Up</h2>
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
                <button className="bg-blue-600 text-white p-2 rounded">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
