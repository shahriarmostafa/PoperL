import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { AuthContext } from "../providers/AuthProvider";
import { db } from "../firebase/firebase.init";

export default function useChatList() {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const unSub = onSnapshot(
      doc(db, "chatCollection", user.uid),
      async (snapshot) => {
        setLoading(true);
        try {
          const idArray = snapshot.data()?.chats || []; // Safely access `chats`
          const promises = idArray.map(async (item) => {
            const collectionName = item.yourRole == "student" ? "studentCollection" :"teacherCollection" ;
            const userDocLink = doc(db, collectionName, item.receiverId);
            const userRes = await getDoc(userDocLink);

            const userss = userRes.exists() ? userRes.data() : {};
            return { ...item, userss };
          });

          const chatData = await Promise.all(promises);

          // Sort chat data by `updatedAt`
          const sortedChatData = chatData.sort((a, b) => b.updatedAt - a.updatedAt);

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

  return { chatList, loading, error };
}