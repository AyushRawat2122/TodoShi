import React from 'react';
import { useAuthStatus } from "../hooks/useAuthStatus.js"
import { Navigate } from "react-router-dom";
import { ServerResponsePage, LoadingPage } from "../components/index.js";
import { Outlet } from 'react-router-dom';

const ProtectedPage = () => {
    const { isSignedIn, isLoading, isServerReady } = useAuthStatus();
    if (isLoading) {
        return <LoadingPage />;
    }
    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace={true} />;
    }
    if (!isServerReady) {
        return <ServerResponsePage />;
    }
    return (
        <div className='h-full w-full'>
            <Outlet />
        </div>
    );
}

export default ProtectedPage;
