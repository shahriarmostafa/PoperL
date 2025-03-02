import { doc, getDoc, increment, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase.init"

export const setTeacherFeedback = async (teacherId, isLike, chatId, index) => {
    const teacherRef = doc(db, "teacherCollection", teacherId);

    const teacherSnap = await getDoc(teacherRef);
    
    if(!teacherSnap.exists()) return;

    const {points, rating} = teacherSnap.data();

    const newPoints = isLike && chatId? points + 2 : points + 5 ;
    const newRating = isLike ? ((5 - rating)/10):  -((5 - rating)/10);

    

    

    await updateDoc(teacherRef, {
        ...(newPoints && {points: newPoints}),
        rating: increment(newRating)
    })

    if(!index || !chatId) return;

    const chatRef = doc(db, "chatDB", chatId);


    // Fetch chat data
    const chatSnap = await getDoc(chatRef);
    
    if (!chatSnap.exists()) return;

    let chatData = chatSnap.data();
    let messages = chatData.messages || [];

    // Update only the selected message's feedback field
    messages[index] = {
        ...messages[index],
        lastMessageFeedback: isLike ? "liked" : "disliked"
    };

    await updateDoc(chatRef, { messages });
}
