import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
const Workspace = () => {
    const { isLoaded, isSignedIn } = useUser();
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    if (!isSignedIn) {
        return <Navigate to={'/sign-in'} replace />;
    }
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default Workspace;
