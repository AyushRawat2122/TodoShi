import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import WorkspaceNav from '../components/WorkspaceNav';
import useTheme from '../hooks/useTheme';
import { ThemeSwitch } from '../components';
import { Link } from 'react-router-dom';

export default function Workspace() {
  const { projectId , projectName } = useParams();
  const { isDark } = useTheme();
  return (
    <div className="h-full flex">
      <div className="">
        <WorkspaceNav projectId={projectId} />
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
