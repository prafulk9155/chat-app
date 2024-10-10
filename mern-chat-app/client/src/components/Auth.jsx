import React from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';

const Auth = () => {
    const { isSignedIn } = useAuth();

    return (
        <div>
            {isSignedIn ? (
                <p>You are signed in!</p>
            ) : (
                <>
                    <SignIn path="/sign-in" routing="path" />
                    <SignUp path="/sign-up" routing="path" />
                </>
            )}
        </div>
    );
};

export default Auth;
