import React from 'react';
import { useParams } from 'react-router-dom';

export default function Todos() {
  const { projectId } = useParams();
  return <div className="p-6">Todos for {projectId} (placeholder)</div>;
}
