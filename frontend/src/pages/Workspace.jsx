import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import WorkspaceNav from '../components/WorkspaceNav';

export default function Workspace() {
  const { projectId } = useParams();
  return (
    <div className="h-full flex">
      <div className="">
        <WorkspaceNav projectId={projectId} />
      </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
