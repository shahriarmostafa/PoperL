import { create } from "zustand";
import { persist } from "zustand/middleware";

export const storeChatList = create(
    persist(
        (set) => ({
            fetchedChatListData: [],
            setFetchedData: (fetchedChatListData) =>{
                set({fetchedChatListData})
            }
        }),
        {
            name: "fetchedChatListData",
            getStorage: () => localStorage
        }
    )
)
