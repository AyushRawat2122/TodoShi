import React from 'react';
import { useAuthStatus } from "../hooks/useAuthStatus.js"
import { Navigate } from "react-router-dom";
import { ServerResponsePage, LoadingPage } from "../components/index.js";


const ProtectedPage = ({ className, children }) => {
    const { isSignedIn, isLoading, isServerReady } = useAuthStatus();
    console.log("Mounted ProtectedPage");
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
        <div className={className}>
            {children}
        </div>
    );
}

export default ProtectedPage;
