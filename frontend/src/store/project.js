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
  
  // New actions for collaborators
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
}));
