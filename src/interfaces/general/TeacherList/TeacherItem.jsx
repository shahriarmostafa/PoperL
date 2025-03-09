import { useNavigate } from 'react-router-dom';
import avatar from '../../../assests/avatar.avif';
import { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';
import { getChatBoxData } from '../../../Hooks/getChatBoxData';
import useSubscription from '../../../Hooks/checkSubscription';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';



export default function TeacherItem({img, name, rating, experience, id, receiver, isOnline}){

    const {user} = useContext(AuthContext);

    const axiosSecure = useAxiosSecure()

    const {isSubscribed, subLoading } = useSubscription(user?.uid);


    const {changeChat} = getChatBoxData();

    const navigate = useNavigate();

    const handleAddChat = async () => {
      if (!isSubscribed) {
        Swal.fire({
          title: "Not Subscribed!",
          icon: "info",
          text: "Please subscribe to continue",
          showCancelButton: true,
          confirmButtonText: "Subscribe",
          confirmButtonColor: "green",
        }).then((response) => {
          if (response.isConfirmed) {
            navigate("/user/subscription");
          }
        });
        return;
      }
    
      // Initialize the SweetAlert toast
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1200, // Set a timeout of 1.2 seconds
        timerProgressBar: true,
      });
    
      // Show the toast with the "Checking existing chat..." message
      const timerInstance = Toast.fire({
        icon: "info",
        title: "Checking existing chat...",
      });
    
      try {
        // Stop the timer while the check and creation process is ongoing
        Swal.stopTimer();
    
        // Check if the chat already exists by calling the backend API
        const response = await axiosSecure.get(`/chatExist/${user.uid}/${id}`);
        
        if (response.data.exists) {
          // If chat exists, navigate to the existing chat
          Swal.resumeTimer();
          Swal.update({
            icon: "info",
            title: "Chat already exists, navigating...",
          });
    
          changeChat(response.data.chatId, receiver, "teacher");
    
          navigate(`/user/chat/${response.data.chatId}`);
        } else {
          // If chat does not exist, create a new chat
          const createChatResponse = await axiosSecure.post("/createChat", {
            userId: user.uid,
            receiverId: id,
          });
    
          // Update Zustand state and navigate to the new chat page
          changeChat(createChatResponse.data.chatId, receiver, "teacher");
    
          Swal.resumeTimer();
          Swal.update({
            icon: "success",
            title: "New chat added successfully!",
          });
    
          navigate(`/user/chat/${createChatResponse.data.chatId}`);
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
              <div className={ isOnline? "online online-status" : "online-status"}>
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