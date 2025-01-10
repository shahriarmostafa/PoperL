import { create } from "zustand";
import { persist } from "zustand/middleware";

export const getChatBoxData = create(
  persist(
    (set) => ({
      chatId: null,
      receiver: null,
      changeChat: (chatId, receiver) => {
        set({ chatId, receiver });
      },
    }),
    {
      name: "chat-box-data", // Key to store the state in localStorage
      getStorage: () => localStorage, // Use localStorage to persist data
    }
  )
);
