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
  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
}));
