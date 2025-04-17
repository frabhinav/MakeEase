// In authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  dropdownOpen: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, dropdownOpen: false }),
  toggleDropdown: () => set((state) => ({ dropdownOpen: !state.dropdownOpen })),
  closeDropdown: () => set({ dropdownOpen: false }),
}));

export default useAuthStore;
