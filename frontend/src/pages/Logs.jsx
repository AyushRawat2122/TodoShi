import React from 'react';
import { useParams } from 'react-router-dom';

export default function Logs() {
  const { projectId } = useParams();
  return <div className="p-6">Logs for {projectId} (placeholder)</div>;
}
