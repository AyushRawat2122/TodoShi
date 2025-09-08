import { create } from "zustand";

export const useProject = create((set, get) => ({
  info: {},

  // actions :
  setInfo: (info) => set({ info: info }),
  editInfo: (key , value) => set(state => ({ info: { ...state.info, [key]: value } })),
}));
