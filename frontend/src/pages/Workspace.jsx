import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Link } from 'react-router-dom';
import WorkspaceNav from '../components/WorkspaceNav.jsx';
import useTheme from '../hooks/useTheme';
import { ThemeSwitch } from '../components';
import { connectSocket, getSocket, disconnectSocket } from "../utils/socket.js"
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStatus } from '../hooks/useAuthStatus.js';

export default function Workspace() {
  const { projectId, projectName } = useParams();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const { isSignedIn } = useAuthStatus();
  useEffect(() => {
    let socket;
    if (isSignedIn) {
      connectSocket().then(() => {
        socket = getSocket();
        if (!socket) return;

        const onConnect = () => console.log("🔌 Connected:", socket.id);
        socket.on("connect", onConnect);

        //listeners here, e.g. messages, todos, etc.
      });
    }
    return () => {
      if (socket) {
        socket.off("connect");
        disconnectSocket();
      }
    };
  }, [isSignedIn]);

  return (
    <div className="h-full flex overflow-hidden">
      <div className="h-full">
        <WorkspaceNav projectId={projectId} projectName={projectName} />
      </div>
      <main className="h-full flex-1 overflow-y-scroll hiddenScroll flex-col px-1 sm:px-6 pb-6 ">
        <div className="mb-4 flex justify-between sticky top-0 items-center bg-gray-50 dark:bg-[#0c0c0c] sm:px-6">
          <h2 className="text-2xl font-bold">Workspace: {projectName}</h2>
          <div className='flex items-center gap-5'>
            <ThemeSwitch />
            <Link to={"/"} replace={true}>
              <img src={isDark ? "/todoshi-branding-light.png" : "/todoshi-branding-dark.png"} className='h-10' alt="logo" />
            </Link>
            {/* Button to open modal */}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowModal(true)}
            >
              Open Modal
            </button>
          </div>
        </div>
        <Outlet />
      </main>
      {/* Framer Motion Popup Modal for whole page */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg min-w-[300px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-2">Popup Modal</h3>
              <p className="mb-4">This is a simple popup modal.</p>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
