import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { AuthContext } from "../providers/AuthProvider";
import { db } from "../firebase/firebase.init";
import { storeChatList } from "./storeChatList";


export default function useChatList() {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {fetchedChatListData, setFetchedData} = storeChatList();

  const [unseenCount, setUnseenCount] = useState(0); // Store unseen messages count



  useEffect(() => {
    if (!user?.uid) return;

    const unSub = onSnapshot(
      doc(db, "chatCollection", user.uid),
      async (snapshot) => {
        setLoading(true);
        try {
          const idArray = snapshot.data()?.chats || []; // Safely access `chats`
          let totalUnseen = 0; // Initialize unseen messages counter
          const promises = idArray.map(async (item) => {
            const collectionName = item.yourRole == "student" ? "studentCollection" :"teacherCollection" ;
            const userDocLink = doc(db, collectionName, item.receiverId);
            const userRes = await getDoc(userDocLink);

            const userss = userRes.exists() ? userRes.data() : {};

            // Count unseen messages
          if (item.isSeen === false) {
            totalUnseen++;
          }

            return { ...item, userss };
          });

          const chatData = await Promise.all(promises);

          // Sort chat data by `updatedAt`
          const sortedChatData = chatData.sort((a, b) => b.updatedAt - a.updatedAt);

          setFetchedData(sortedChatData);
          setUnseenCount(totalUnseen);
          setChatList(sortedChatData);
        } catch (err) {
          console.error("Error fetching chat list:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error with Firestore listener:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unSub(); // Cleanup listener on component unmount
  }, [user?.uid]);

  return { chatList, loading, error, unseenCount };
}