import { doc, getDoc, increment, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase.init"
import useAxiosSecure from "./useAxiosSecure"
export const setTeacherFeedback = async (teacherId, isLike, chatId, index) => {
    const teacherRef = doc(db, "teacherCollection", teacherId);
    const axiosSecure = useAxiosSecure()

    const teacherSnap = await getDoc(teacherRef);
    
    if(!teacherSnap.exists()) return;

    const {points, rating} = teacherSnap.data();

    const newPoints = isLike && chatId? points + 2 : points - 2 ;
    const newRating = isLike ? ((5 - rating)/10):  -((5 - rating)/10);

    

    

    await updateDoc(teacherRef, {
        ...(newPoints && {points: newPoints}),
        rating: increment(newRating)
    })

    if(!index || !chatId) return;
    

    try {
        axiosSecure.put('/update-feedback', {
            chatId,
            index,
            isLike,
        });
    } catch (error) {
        console.error('Failed to update feedback:', error);
    }
}
