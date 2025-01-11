import { create } from "zustand";
import { persist } from "zustand/middleware";

export const getChatBoxData = create(
  persist(
    (set) => ({
      chatId: null,
      receiver: null,
      yourRole: null,
      changeChat: (chatId, receiver, yourRole) => {
        set({ chatId, receiver, yourRole });
      },
    }),
    {
      name: "chat-box-data", // Key to store the state in localStorage
      getStorage: () => localStorage, // Use localStorage to persist data
    }
  )
);
