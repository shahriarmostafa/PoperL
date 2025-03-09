import {Link, useNavigate } from "react-router-dom";
import useChatList from "../../../Hooks/useChatList";
import PeopleItem from "./PeopleItem";
import { getChatBoxData } from "../../../Hooks/getChatBoxData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase.init";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { storeChatList } from "../../../Hooks/storeChatList";
import useSubscription from "../../../Hooks/checkSubscription";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


export default function People(){


    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure()
     
    const {changeChat} = getChatBoxData();
    //calling device user
    const {user} = useContext(AuthContext);
    const { chatList, loading, error } = useChatList();
    
    const {fetchedChatListData, setFetchedData} = storeChatList();

    
    const {isSubscribed, subLoading, userRole  } = useSubscription(user?.uid);
    
    

    const handleOpenChat = async (chatIdTaken, receiverPerson, yourRole) => {
        
        

        
        if(loading){
            changeChat(chatIdTaken, receiverPerson, yourRole);
            navigate(`/user/chat/${chatIdTaken}`);
            return
        }
        else{
            const userFinalChat = chatList.map(item => {
                const {otherUser, ...rest} = item;
                return rest
            })
            const chatIndex = userFinalChat.findIndex((item) => {
                return item.chatId === chatIdTaken
            })

            changeChat(chatIdTaken, receiverPerson, yourRole);
            navigate(`/user/chat/${chatIdTaken}`);
    
            userFinalChat[chatIndex].isSeen = true;
            try{
                axiosSecure.put("/mark-chat-as-seen", {
                    userId: user.uid,
                    chatId: chatIdTaken,
                })

            }catch(err){
                console.log(err);
                
            }
        }
    }

    

    
    
    
    if (loading || subLoading) {
        console.log(fetchedChatListData);
        
        return (
            <div className="left-side">
                <div className="chat-list">
                    {
                         fetchedChatListData.map((x, index) => {                                                        
                            return <PeopleItem clickFunc={() => handleOpenChat(x.chatId, x.userss, x.yourRole, x.isSeen)} isSeen={x.isSeen} userId={x.userss.uid} key={x.chatId} chatID={x.chatId} img={x.userss.photoURL} name={x.userss.displayName} lastMessage={x.lastMessage}></PeopleItem>
                        })
                    }
                </div>
                <b>Reloading Chat...</b>
            </div>
        )
    }


    if(!isSubscribed && userRole === "student"){
        return (
            <div className=" left-side d-flex align-items-center text-center justify-content-center">
                <div className="inner">
                <b className="message">You are not subscribed</b>
                <b className="message">Please select a package</b>

                <Link to="/user/subscription"><button className="btn btn-secondary mt-2">Select Package</button></Link>
                </div>

            </div>
        )
    }

    if (error || chatList.length == 0){ 
        return (
            <div className=" left-side d-flex align-items-center text-center justify-content-center">
                <b className="message">
                    No chat found <br />
                (Contact the authority if any issue)
                </b>
            </div>
        )
    };
    
        return(
            <div className="left-side">
                <div className="chat-list">
                    {
                         chatList.map((x, index) => {                                                        
                            return <PeopleItem clickFunc={() => handleOpenChat(x.chatId, x.userss, x.yourRole, x.isSeen)} isSeen={x.isSeen} userId={x.userss.uid} key={x.chatId} chatID={x.chatId} img={x.userss.photoURL} name={x.userss.displayName} lastMessage={x.lastMessage} isOnline={x.userss.isOnline}></PeopleItem>
                        })
                    }
                </div>
            </div>
        )
    
}