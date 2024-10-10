import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import SignUp from './components/SignUp';
import Login from './components/Login';
import UserList from './components/UserList';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = 'pk_test_bWVhc3VyZWQtbGVtdXItMTkuY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
const App = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} >
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/chat/:userId" element={<Chat />} />
                </Routes>
            </Router>
        </ClerkProvider>
    );
};

export default App;
