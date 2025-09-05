import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import WorkspaceNav from '../components/WorkspaceNav.jsx';
import useTheme from '../hooks/useTheme';
import { ThemeSwitch } from '../components';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { connectSocket, getSocket, disconnectSocket } from "../utils/socket.js"
export default function Workspace() {
  const { projectId, projectName } = useParams();
  const { isDark } = useTheme();
  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    if (!socket) return;

    const onConnect = () => console.log("🔌 Connected:", socket.id);
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
      disconnectSocket();
    };
  }, []);

  return (
    <div className="h-full flex">
      <div className="">
        <WorkspaceNav projectId={projectId} projectName={projectName} />
      </div>
      <main className="flex-1 flex-col p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Workspace: {projectName}</h2>
          <div className='flex items-center gap-5'>
            <ThemeSwitch />
            <Link to={"/"} replace={true}>
              <img src={isDark ? "/todoshi-branding-light.png" : "/todoshi-branding-dark.png"} className='h-10' alt="logo" />
            </Link>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
