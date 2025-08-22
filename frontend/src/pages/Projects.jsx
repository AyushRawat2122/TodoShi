import React from 'react';
import { useParams } from 'react-router-dom';

export default function Projects() {
  const { projectId } = useParams();
  return <div className="p-6">Projects {projectId ? `(project ${projectId})` : '(list)'} (placeholder)</div>;
}
