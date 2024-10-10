import React from 'react';
import Chat from './components/Chat';
import './index.css'; // Make sure to import your Tailwind CSS
import SignInPage from './sign-in/[[...index]]';
import SignUpPage from './sign-up/[[...index]]';

const App = () => {
    return (
        <div>
            <Chat />
            <SignInPage />
            <SignUpPage />
        </div>
    );
};

export default App;
