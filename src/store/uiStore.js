// src/store/uiStore.js
import { create } from "zustand";

const useUIStore = create((set) => ({
  showChat: false,
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  closeChat: () => set({ showChat: false }),
}));

export default useUIStore;
