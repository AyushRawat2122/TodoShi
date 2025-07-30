import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
const Workspace = () => {
    const { isLoaded, isSignedIn } = useUser();
    if (!isLoaded) {
        console.log("User data is still loading");
        return <div>Loading...</div>;
    }
    if (!isSignedIn) {
        console.log("User is not signed in");
        return <Navigate to={'/sign-in'} replace />;
    }

    console.log("User is signed in");
    return (
        <div>
            <h1>Welcome to the Workspace</h1>
            <Outlet />
        </div>
    );
}

export default Workspace;
