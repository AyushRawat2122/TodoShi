import { create } from "zustand";

const useProject = create((set, get) => ({
  info: {
    activeStatus: true,
    image: { publicId: "", url: "" },
    title: "",
    description: "",
    links: [],
    srs: { publicId: "", url: "" },
    deadline: "",
    createdAt: "",
  },
  isOwner: false,
  owner: {
    avatar: "",
    username: "",
    userId: "",
  },
  roomID: "",
  collaborators: [],
  chats: [],
  oldestMessageId: null, // Track the oldest message ID for pagination
  logs: [],
  todos: [],
  currentTodosDate: null, // Track which date's todos are currently loaded
  imageViewer: {
    isOpen: false,
    contextUrl: null,
  },
  // Online users state
  onlineUsers: [],
  // actions :
  setInfo: (newInfo) => set((state) => ({ info: { ...state.info, ...newInfo } })),
  setIsOwner: (isOwner) => set({ isOwner }),
  setOwner: (owner) =>
    set({
      owner: {
        avatar: owner.avatar || "",
        username: owner.username || "",
        userId: owner.userId || "",
      },
    }),
  setRoomID: (roomID) => set({ roomID }),
  setLogs: (logs) => set({ logs: logs }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setCollaborators: (collaborators) => set({ collaborators }),
  addCollaborator: (collaborator) =>
    set((state) => ({
      collaborators: [...state.collaborators, collaborator],
    })),
  removeCollaborator: (collaboratorId) =>
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c._id !== collaboratorId),
    })),
  updateCollaborator: (collaboratorId, updates) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c._id === collaboratorId ? { ...c, ...updates } : c
      ),
    })),
  // Chat actions
  setChats: (chats) => {
    const oldestId = chats.length > 0 ? chats[0]._id : null;
    set({ chats, oldestMessageId: oldestId });
  },
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  prependChats: (olderChats) =>
    set((state) => {
      // Filter out duplicates
      const existingIds = new Set(state.chats.map((c) => c._id));
      const filtered = olderChats.filter((c) => !existingIds.has(c._id));
      const newChats = [...filtered, ...state.chats];
      const oldestId = newChats.length > 0 ? newChats[0]._id : null;
      return { chats: newChats, oldestMessageId: oldestId };
    }),
  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat._id !== chatId),
    })),
  clearChats: () => set({ chats: [], oldestMessageId: null }),
  // Todo actions
  setTodos: (todos, date) => set({ todos, currentTodosDate: date }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (todoId, updates) =>
    set((state) => ({
      todos: state.todos.map((t) => (t._id === todoId ? { ...t, ...updates } : t)),
    })),
  removeTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((t) => t._id !== todoId),
    })),
  // Image viewer actions
  openImageViewer: (url) => set({ imageViewer: { isOpen: true, contextUrl: url } }),
  closeImageViewer: () => set({ imageViewer: { isOpen: false, contextUrl: null } }),
  // Online users methods
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (user) =>
    set((state) => {
      // Prevent duplicates
      if (state.onlineUsers.some((u) => u.userId === user.userId)) {
        return state;
      }
      return { onlineUsers: [...state.onlineUsers, user] };
    }),

  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u.userId !== userId),
    })),

  clearOnlineUsers: () => set({ onlineUsers: [] }),
}));

export { useProject };
