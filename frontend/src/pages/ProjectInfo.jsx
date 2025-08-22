import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectInfo() {
  const { projectId } = useParams();
  return <div className="p-6">Project Info for {projectId} (placeholder)</div>;
}
