import React from 'react';
import { useParams } from 'react-router-dom';

export default function Collaborators() {
  const { projectId } = useParams();
  return <div className="p-6">Collaborators for {projectId} (placeholder)</div>;
}
