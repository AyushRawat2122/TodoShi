import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
const Workspace = () => {
    return (
        <div>
            <h1>Welcome to the Workspace</h1>
            <Outlet />
        </div>
    );
}

export default Workspace;
