import React from 'react';
import { useParams } from 'react-router-dom';

export default function Chat() {
  const { projectId } = useParams();
  return <div className="p-6">Chat for {projectId} (placeholder)</div>;
}
