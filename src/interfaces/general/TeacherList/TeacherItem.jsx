import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../../assests/avatar.avif';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.init';
import { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';



export default function TeacherItem({img, name="Rahim Khan", rating=4.5, experience=2, id}){

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleAddChat = async() => {

        const chatDBRef = collection(db, "chatDB");
        const userChatDBRef = collection(db, "chatCollection");
        try{
            const newChatRef = doc(chatDBRef);
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            })
            await updateDoc(doc(userChatDBRef, id),{
                chats: arrayUnion({
                    yourRole: "student",
                    chatId: newChatRef.id,
                    lastMessage : "",
                    receiverId: user.uid,
                    updatedAt: Date.now()
                })
            })
            await updateDoc(doc(userChatDBRef, user.uid),{
                chats: arrayUnion({
                    yourRole: "teacher",
                    chatId: newChatRef.id,
                    lastMessage : "",
                    receiverId: id,
                    updatedAt: Date.now()
                })
            })
            navigate("/chat");
        }
        catch (err){
            console.log(err);
        }
    }
    return(
        <div className="box teacher">
            <div className="photo">
                <img src={img || avatar} alt=""></img>
            </div>
            <div className="info">
                <h3 className="name">{name}</h3>
                <span className="rating">{rating}/5.0 Appreciated</span>
                <span className="level">{experience}PT Experienced</span>
                <button onClick={handleAddChat}>Study</button>
            </div>
        </div>
    )
}