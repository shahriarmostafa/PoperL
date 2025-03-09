import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { storeChatList } from "./storeChatList";
import socket from "./socket"; // Import Socket.io client

export default function useChatList() {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchedChatListData, setFetchedData } = storeChatList();
  const [unseenCount, setUnseenCount] = useState(0); // Store unseen messages count // Store unseen messages count



  useEffect(() => {
    if (!user?.uid) return;

    // Join the user's room
    socket.emit('joinRoom', user.uid);

    // Listen for chat list updates
    socket.on('chatListUpdate', ({ chatList, unseenCount }) => {
        setChatList(chatList);
        setFetchedData(chatList)
        setUnseenCount(unseenCount);
        setLoading(false);
    });

    // Listen for errors
    socket.on('chatListError', (err) => {
        setError(err.message);
        setLoading(false);
    });

    // Cleanup listeners on component unmount
    return () => {
        socket.off('chatListUpdate');
        socket.off('chatListError');
    };
}, [user?.uid]);

return { chatList, loading, error, unseenCount };
}