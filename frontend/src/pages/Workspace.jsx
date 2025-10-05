import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Link, useNavigate } from 'react-router-dom';
import WorkspaceNav from '../components/WorkspaceNav.jsx';
import useTheme from '../hooks/useTheme';
import { ThemeSwitch, Loader } from '../components/index.js';
import { connectSocket, getSocket, disconnectSocket } from "../utils/socket.js"
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import serverRequest from '../utils/axios.js';
import { useProject } from '../store/project.js';
import { useSocketOn } from '../hooks/useSocket.js';

export default function Workspace() {
  const { projectId, projectName } = useParams();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const { isSignedIn } = useAuthStatus();
  const { setInfo, info, setIsOwner, setOwner, setRoomID, logs, addLog, setLogs, setTodos, addTodo, updateTodo, removeTodo, currentTodosDate } = useProject();
  const navigate = useNavigate();

  // Utility function to format date in local timezone
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // lets verify first that you ve access to this project or not
  useEffect(() => {
    const verifyAccess_populateProject = async () => {
      try {
        const { data } = await serverRequest.get(`/projects/get/${projectId}`, { headers: { "Content-Type": "application/json" } });
        const projectData = data?.data;
        console.log("data :", projectData);
        
        const newInfo = {
          activeStatus: true,
          description: projectData?.description,
          image: projectData?.ProjectImage || { publicId: "", url: "" },
          title: projectData?.title || [],
          links: projectData?.links || [],
          deadline: projectData?.deadline || "",
          srs: projectData?.srsDocFile || { publicId: "", url: "" },
          createdAt: projectData?.createdAt || "",
        }

        const ownerData = {
          avatar: projectData?.createdBy?.avatar?.url || "",
          username: projectData?.createdBy?.username || "",
          userId: projectData?.createdBy?._id || "",
        }

        setInfo(newInfo);
        setIsOwner(projectData?.isOwner || false);
        setOwner(ownerData);

        // Fetch logs
        const { data: logData } = await serverRequest.get(`/logs/${projectId}`, { headers: { "Content-Type": "application/json" } });
        setLogs(logData?.data || []);

        // Fetch current date todos
        const currentDateString = formatDateToLocal(new Date());
        console.log("📅 Fetching todos for current date:", currentDateString);
        try {
          const { data: todoData } = await serverRequest.get(`/todos/${projectId}?date=${currentDateString}`);
          console.log("✅ Current date todos fetched:", todoData?.data);
          setTodos(todoData?.data || [], currentDateString);
        } catch (todoError) {
          console.error("❌ Error fetching current date todos:", todoError);
          setTodos([], currentDateString);
        }

        console.log("Project access verified and data populated.");
        setIsValid(true);
      } catch (error) {
        if (error.status === 403) {
          navigate("/unauthorized", { replace: true });
        } else if (error.status === 404) {
          navigate("/not-found", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }
    verifyAccess_populateProject();
  }, []);

  useEffect(() => {
    let socket;
    if (isSignedIn && !loading && isValid) {
      connectSocket().then(() => {
        socket = getSocket();
        if (!socket) return;
        const roomID = projectName.trim().slice(0, 2) + projectId.trim();
        console.log("Joining room:", roomID);
        const onConnect = () => console.log("🔌 Connected:", socket.id);
        socket.on("connect", onConnect);
        socket.emit("joinProjectRoom", { roomID: roomID })
        socket.on("room-connection-error", (error) => { console.error("Room connection error:", error); })
        socket.on("room-connection-success", (roomID) => { console.log("User Joined room Successfully:", roomID); setRoomID(roomID); })
      });
    }
    return () => {
      if (socket) {
        socket.off("connect");
        disconnectSocket();
      }
    };
  }, [isSignedIn, loading, isValid]);

  useEffect(() => {
    console.log("Project Info updated:", info);
    console.log("Project Logs updated:", logs);
  }, [info, logs]);

  // ========== SOCKETS - Server Errors ==========
  useSocketOn("server-error", (errorMsg) => {
    console.log(errorMsg);
  });

  // ========== SOCKETS - Logs page ==========
  useSocketOn("new-project-log", (newLog) => {
    addLog(newLog);
    console.log("New log received:", { newLog });
  });

  // ========== SOCKETS - Info page ==========
  useSocketOn("project-details-update", (updatedInfo) => {
    setInfo(updatedInfo);
  });
  useSocketOn("project-links-update", (updatedLinks) => {
    setInfo(updatedLinks);
  });
  useSocketOn("project-srs-update", (updatedSrs) => {
    setInfo(updatedSrs);
  });
  useSocketOn("project-description-update", (updatedDesc) => {
    setInfo(updatedDesc);
  });

  // ========== SOCKETS - Todo Page Events ==========
  // Only listen to todo events if currently viewing today's todos
  useSocketOn("new-todo", (newTodo) => {
    console.log("🔔 Socket received new-todo:", newTodo);
    console.log("📅 Todo date field:", newTodo.date);
    console.log("📅 Current todos date:", currentTodosDate);
    
    // Now we use the date field directly - no timezone conversion needed!
    if (currentTodosDate === newTodo.date) {
      console.log("✅ Adding new todo to state");
      addTodo(newTodo);
    } else {
      console.log("⏭️ Ignoring new-todo event - viewing different date");
    }
  });

  useSocketOn("todo-completed", (updatedTodo) => {
    if (currentTodosDate === updatedTodo.date) {
      console.log("✅ Todo completed via socket:", updatedTodo);
      updateTodo(updatedTodo._id, { status: true });
    } else {
      console.log("⏭️ Ignoring todo-completed event - viewing different date");
    }
  });

  useSocketOn("todo-pending", (updatedTodo) => {
    if (currentTodosDate === updatedTodo.date) {
      console.log("⏳ Todo marked pending via socket:", updatedTodo);
      updateTodo(updatedTodo._id, { status: false });
    } else {
      console.log("⏭️ Ignoring todo-pending event - viewing different date");
    }
  });

  useSocketOn("todo-deleted", (deletedTodo) => {
    if (currentTodosDate === deletedTodo.date) {
      console.log("🗑️ Todo deleted via socket:", deletedTodo);
      removeTodo(deletedTodo._id);
    } else {
      console.log("⏭️ Ignoring todo-deleted event - viewing different date");
    }
  });

  if (loading) {
    return (<div className='h-full w-full flex items-center bg-gray-50 dark:bg-[#0c0c0c] justify-center'>
      <Loader className={"text-4xl"} />
    </div>
    )
  }

  return (
    <div className="h-full flex overflow-hidden">
      <div className="h-full">
        <WorkspaceNav projectId={projectId} projectName={projectName} />
      </div>
      <main className="h-full flex-1 overflow-y-scroll hiddenScroll flex-col px-1 sm:px-6 pb-6 ">
        <div className="mb-4 flex justify-between sticky z-[20] -top-1 items-center bg-gray-50 dark:bg-[#0c0a1a] sm:px-6">
          <h2 className="text-2xl font-bold">Workspace<span className='max-sm:hidden'>:{projectName}</span></h2>
          <div className='flex items-center gap-5'>
            <ThemeSwitch />
            <Link to={"/"} replace={true}>
              <img src={isDark ? "/todoshi-branding-light.png" : "/todoshi-branding-dark.png"} className='h-10' alt="logo" />
            </Link>
            {/* Button to open modal */}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hidden"
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