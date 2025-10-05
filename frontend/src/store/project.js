import { create } from "zustand";

export const useProject = create((set, get) => ({
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
  logs: [],
  todos: [],
  currentTodosDate: null, // Track which date's todos are currently loaded
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
  addCollaborator: (collaborator) => set((state) => ({ 
    collaborators: [...state.collaborators, collaborator] 
  })),
  removeCollaborator: (collaboratorId) => set((state) => ({
    collaborators: state.collaborators.filter(c => c._id !== collaboratorId)
  })),
  updateCollaborator: (collaboratorId, updates) => set((state) => ({
    collaborators: state.collaborators.map(c => 
      c._id === collaboratorId ? { ...c, ...updates } : c
    )
  })),
  // Todo actions
  setTodos: (todos, date) => set({ todos, currentTodosDate: date }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (todoId, updates) => set((state) => ({
    todos: state.todos.map(t => t._id === todoId ? { ...t, ...updates } : t)
  })),
  removeTodo: (todoId) => set((state) => ({
    todos: state.todos.filter(t => t._id !== todoId)
  })),
}));
