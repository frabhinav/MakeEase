// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useChatStore = create(
//   persist(
//     (set, get) => ({
//       isSidebarOpen: false,
//       currentUser: null,
//       chatHistory: {},

//       toggleSidebar: () =>
//         set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

//       setCurrentUser: (user) => set({ currentUser: user }),

//       setChatHistory: (user, messages) =>
//         set((state) => ({
//           chatHistory: {
//             ...state.chatHistory,
//             [user]: messages,
//           },
//         })),

//       addMessage: (user, message) =>
//         set((state) => ({
//           chatHistory: {
//             ...state.chatHistory,
//             [user]: [...(state.chatHistory[user] || []), message],
//           },
//         })),

//       createNewChat: () => {
//         const newChatId = `chat-${Date.now()}`;
//         const { chatHistory, currentUser } = get();

//         set({
//           chatHistory: {
//             ...chatHistory,
//             [currentUser]: [...(chatHistory[currentUser] || []), newChatId], // Add new chat under current user
//           },
//           currentUser: newChatId,
//         });
//       },

//       resetStore: () =>
//         set({
//           isSidebarOpen: false,
//           currentUser: null,
//           chatHistory: {},
//         }),

//       clearUserChats: () => {
//         const { currentUser, chatHistory } = get();
//         set({
//           chatHistory: {
//             ...chatHistory,
//             [currentUser]: [], // Clear the current user's chat history
//           },
//         });
//       },
//     }),
//     {
//       name: "chat-storage",
//     }
//   )
// );

// export default useChatStore;

import { create } from "zustand";
import { db } from "../firebase"; // make sure the path is correct
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import useAuthStore from "./authStore";

const useChatStore = create((set, get) => ({
  isSidebarOpen: false,
  chatHistory: {},
  currentUser: null,
  setCurrentUser: (id) => set({ currentUser: id }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Load user chat from Firestore
  loadUserChats: async () => {
    const { user } = useAuthStore.getState();
    if (!user || !user.uid) return;

    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      set({ chatHistory: data.chatHistory || {} });
    } else {
      // If no doc, create empty history
      await setDoc(docRef, { chatHistory: {} });
      set({ chatHistory: {} });
    }
  },

  // Save message to Firestore and Zustand
  addMessage: async (chatId, message) => {
    const { user } = useAuthStore.getState();
    if (!user || !user.uid) return;
    const { chatHistory } = get();

    const updatedChat = [...(chatHistory[chatId] || []), message];
    const updatedChatHistory = {
      ...chatHistory,
      [chatId]: updatedChat,
    };

    set({ chatHistory: updatedChatHistory });

    const docRef = doc(db, "Users", user.uid);
    await updateDoc(docRef, {
      chatHistory: updatedChatHistory,
    });
  },

  // Create a new chat
  createNewChat: async () => {
    const { user } = useAuthStore.getState();
    if (!user || !user.uid) return;
    const { chatHistory } = get();
    const newChatId = `chat-${Date.now()}`;

    const updatedChatHistory = {
      ...chatHistory,
      [newChatId]: [],
    };

    set({ chatHistory: updatedChatHistory });

    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { chatHistory: updatedChatHistory });
    } else {
      await setDoc(docRef, { chatHistory: updatedChatHistory });
    }

    // await updateDoc(docRef, {
    //   chatHistory: updatedChatHistory,
    // });

    return newChatId;
  },

  clearUserChats: async () => {
    const { user } = useAuthStore.getState();
    if (!user || !user.uid) return;
    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    set({ chatHistory: {} });
    if (docSnap.exists()) {
      await updateDoc(docRef, { chatHistory: {} });
    } else {
      await setDoc(docRef, { chatHistory: {} });
    }
    // await updateDoc(docRef, {
    //   chatHistory: {},
    // });
  },

  resetStore: () =>
    set({
      isSidebarOpen: false,
      chatHistory: {},
    }),
}));

export default useChatStore;
