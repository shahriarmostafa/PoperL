import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../../assests/avatar.avif';
import { arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.init';
import { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';
import { getChatBoxData } from '../../../Hooks/getChatBoxData';
import useSubscription from '../../../Hooks/checkSubscription';



export default function TeacherItem({img, name, rating, experience, id, receiver, isOnline}){

    const {user} = useContext(AuthContext);

    const {isSubscribed, subLoading } = useSubscription(user?.uid);


    const {changeChat} = getChatBoxData();

    const navigate = useNavigate();

    const handleAddChat = async () => {


        if(!isSubscribed){
          Swal.fire({
            title: "Not Subscribed!",
            icon: "info",
            text: "Please subscribe to continue",
            showCancelButton: true,
            confirmButtonText: "Subscribe",
            confirmButtonColor: "green"
          }).then(response => {
            if(response.isConfirmed){
              navigate("/user/subscription")
            }
          })
          return;
        }



        const chatDBRef = collection(db, "chatDB");
        const userChatDBRef = collection(db, "chatCollection");
      
        // Initialize the SweetAlert toast
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 1200, // Set a timeout of 5 seconds (adjust as needed)
          timerProgressBar: true,
        });
      
        // Show the toast with the "Adding new chat" message
        const timerInstance = Toast.fire({
          icon: "info",
          title: "Checking existing chat...",
        });
      
        try {
          // Stop the timer while the check and creation process is ongoing
          Swal.stopTimer();
      
          // Check if the chat already exists in the user's chat collection
          const userChatSnapshot = await getDoc(doc(userChatDBRef, user.uid));
          const userChats = userChatSnapshot.exists() ? userChatSnapshot.data().chats : [];
      
          // Look for a chat with the specified receiver
          const existingChat = userChats.find(chat => chat.receiverId === id);
      
          if (existingChat) {
            // If the chat already exists, navigate to chat/{chatId}
            Swal.resumeTimer();
            Swal.update({
              icon: "info",
              title: "Chat already exists, navigating...",
            });

            changeChat(existingChat.chatId, receiver, "teacher");
      
            // Navigate to the existing chat by its chatId
            navigate(`/user/chat/${existingChat.chatId}`);
          } else {
            // If the chat does not exist, create a new chat
            const newChatRef = doc(chatDBRef);
            await setDoc(newChatRef, {
              createdAt: serverTimestamp(),
              messages: [],
            });
      
            // Update the user's chat collection with the new chat
            await updateDoc(doc(userChatDBRef, id), {
              chats: arrayUnion({
                yourRole: "student",
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: user.uid,
                updatedAt: Date.now(),
              }),
            });
      
            await updateDoc(doc(userChatDBRef, user.uid), {
              chats: arrayUnion({
                yourRole: "teacher",
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: id,
                updatedAt: Date.now(),
              }),
            });
      
            // Resume the timer and show a success message
            Swal.resumeTimer();
            Swal.update({
              icon: "success",
              title: "New chat added successfully!",
            });
      
            // Navigate to the newly created chat page
            navigate("/user/chat");
          }
        } catch (err) {
          // Handle any errors and stop the timer
          console.log(err);
          Swal.stopTimer();
          Swal.update({
            icon: "error",
            title: "An error occurred",
            text: err.message,
          });
        }
      };
      
      
      
    return(
        <div className="box teacher">
            <div className="photo">
              <div className={`online-status ${isOnline && "online"}`}>
                <div className="dot"></div>
                <div className="text">{isOnline? "Online": "Ofline"}</div>
              </div>
                <img src={img || avatar} alt=""></img>
            </div>
            <div className="info">
                <h3 className="name">{name}</h3>
                <span className="rating">{Number(rating).toFixed(1)}/5.0 Appreciated</span>
                <span className={experience > 0 && `level`}>{experience}PP Experience</span>
                <button onClick={handleAddChat}>Message</button>
            </div>
        </div>
    )
}