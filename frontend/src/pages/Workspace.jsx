import React from 'react';
import { Outlet } from 'react-router-dom';
const Workspace = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default Workspace;
