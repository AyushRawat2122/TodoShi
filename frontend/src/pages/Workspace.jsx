import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Link, useNavigate } from 'react-router-dom';
import WorkspaceNav from '../components/WorkspaceNav.jsx';
import useTheme from '../hooks/useTheme';
import { ThemeSwitch, Loader } from '../components/index.js';
import { connectSocket, getSocket, disconnectSocket } from "../utils/socket.js"
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import serverRequest from '../utils/axios.js';
import { useProject } from '../store/project.js';
import { useSocketOn } from '../hooks/useSocket.js';
import useUser from '../hooks/useUser.js';
import GlobalImageViewer from '../components/GlobalImageViewer.jsx';
import { showErrorToast, showInfoToast } from '../utils/toastMethods';

export default function Workspace() {
  const { projectId, projectName } = useParams();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const { isSignedIn } = useAuthStatus();
  const {
    setInfo,
    info,
    setIsOwner,
    setOwner,
    setRoomID,
    logs,
    addLog,
    setLogs,
    setTodos,
    addTodo,
    updateTodo,
    removeTodo,
    currentTodosDate,
    removeCollaborator,
    setOnlineUsers,
    clearOnlineUsers,
    addChat,
    removeChat,
    setChats,
  } = useProject();
  const navigate = useNavigate();
  const { user } = useUser();

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
        try {
          const { data: todoData } = await serverRequest.get(`/todos/${projectId}?date=${currentDateString}`);
          setTodos(todoData?.data || [], currentDateString);
        } catch (todoError) {
          setTodos([], currentDateString);
        }

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
    const roomID = projectName.trim().slice(0, 2) + projectId.trim();
    if (isSignedIn && !loading && isValid) {
      connectSocket().then(() => {
        socket = getSocket();
        if (!socket) return;

        socket.on("connect", () => {
          // Connection established - debug only
        });

        socket.emit("joinProjectRoom", { roomID: roomID, userId: user.data._id });

        socket.on("room-connection-error", (message, error) => {
          showErrorToast(`Connection error: ${message || "room connection failed"}`);
        });

        socket.on("room-connection-success", async (roomID) => {
          setRoomID(roomID);

          // Fetch initial messages when room is joined successfully
          try {
            const { data } = await serverRequest.get(`/chats/getPreviousMessages/${projectId}`);
            const messages = data?.data || [];
            if (messages.length > 0) {
              setChats(messages);
            } else {
              setChats([]);
            }
          } catch (error) {
            setChats([]);
          }
        });
      });
    }
    return () => {
      if (socket) {
        socket.off("connect");
        clearOnlineUsers();
        disconnectSocket();
      }
    };
  }, [isSignedIn, loading, isValid]);

  // ========== SOCKETS - Server Errors (KEEP TOAST) =========
  useSocketOn("server-error", (errorMsg) => {
    showErrorToast(errorMsg);
  });

  // ========== SOCKETS - Logs page (KEEP TOAST) =========
  useSocketOn("new-project-log", (newLog) => {
    addLog(newLog);
    showInfoToast(`New log: ${newLog.description || 'Log added'}`);
  });

  // ========== SOCKETS - Info page (KEEP TOAST) =========
  useSocketOn("project-details-update", (updatedInfo) => {
    setInfo(updatedInfo);
    showInfoToast('Project details updated');
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

  // ========== SOCKETS - Todo Page Events (REMOVE TOASTS) =========
  useSocketOn("new-todo", (newTodo) => {
    if (currentTodosDate === newTodo.date) {
      addTodo(newTodo);
      showInfoToast('New task added');
    }
  });

  useSocketOn("todo-completed", (updatedTodo) => {
    if (currentTodosDate === updatedTodo.date) {
      updateTodo(updatedTodo._id, { status: true });
    }
  });

  useSocketOn("todo-pending", (updatedTodo) => {
    if (currentTodosDate === updatedTodo.date) {
      updateTodo(updatedTodo._id, { status: false });
    }
  });

  useSocketOn("todo-deleted", (deletedTodo) => {
    if (currentTodosDate === deletedTodo.date) {
      removeTodo(deletedTodo._id);
    }
  });

  // ========== SOCKETS - Online Users Update (NO TOAST) =========
  useSocketOn("online-users-update", ({ onlineUsers, totalCount }) => {
    setOnlineUsers(onlineUsers);
  });

  // ========== SOCKETS - Collaborator left event (REMOVE TOAST) =========
  useSocketOn("collaborator-left", (collaborator) => {
    removeCollaborator(collaborator.userId);

    if (collaborator.userId === user.data._id) {
      clearOnlineUsers();
      disconnectSocket();
      navigate("/", { replace: true });
    }
  });

  // ========== SOCKETS - Chat Events  =========
  useSocketOn("new-message", (newMessage) => {
    addChat(newMessage);
  });

  useSocketOn("message-deleted", ({ messageId }) => {
    removeChat(messageId);
  });

  // =======================================================================
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
        <Outlet className="flex-1" />
      </main>

      {/* Global Image Viewer */}
      <GlobalImageViewer />
    </div>
  );
}