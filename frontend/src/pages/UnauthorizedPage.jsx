import React from "react";
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-600">You do not have permission to view this page.</p>
    </div>
  );
}
