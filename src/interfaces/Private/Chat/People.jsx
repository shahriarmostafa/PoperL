import {useLocation, useNavigate } from "react-router-dom";
import useChatList from "../../../Hooks/useChatList";
import PeopleItem from "./PeopleItem";
import { getChatBoxData } from "../../../Hooks/getChatBoxData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase.init";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { storeChatList } from "../../../Hooks/storeChatList";
import GetClickDetection from "../../../Hooks/getClickDetection";


export default function People(){

    const navigate = useNavigate();
     
    const {changeChat} = getChatBoxData();
    //calling device user
    const {user} = useContext(AuthContext);
    const { chatList, loading, error } = useChatList();
    
    const {fetchedChatListData, setFetchedData} = storeChatList();

    const handleClick = () => {
        setFetchedData(chatList);
        
    } 

    
    

    const handleOpenChat = async (chatIdTaken, receiverPerson, yourRole) => {
        const userFinalChat = chatList.map(item => {
            const {otherUser, ...rest} = item;
            return rest
        })
        const chatIndex = userFinalChat.findIndex((item) => {
            return item.chatId === chatIdTaken
        })

        userFinalChat[chatIndex].isSeen = true;

        const userChatRef = doc(db, "chatCollection", user.uid);

        try{
            await updateDoc(userChatRef, {
                chats: userFinalChat
            })
            changeChat(chatIdTaken, receiverPerson, yourRole);
        }catch(err){
            console.log(err);
            
        }

        navigate(`/chat/${chatIdTaken}`);
    }
    
    if (loading) {
        return (
            <div className="left-side">
                <div className="chat-list">
                    {
                         fetchedChatListData.map((x, index) => {                                                        
                            return <PeopleItem clickFunc={() => handleOpenChat(x.chatId, x.userss, x.yourRole, x.isSeen)} isSeen={x.isSeen} userId={x.userss.uid} key={x.chatId} chatID={x.chatId} img={x.userss.photoURL} name={x.yourRole == "student"? `Student ${index + 1}`: x.userss.displayName} lastMessage={x.lastMessage}></PeopleItem>
                        })
                    }
                    <b>Refreshing Chat...</b>
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
                <GetClickDetection handleClick={handleClick}></GetClickDetection>
                <div className="chat-list">

                    {
                         chatList.map((x, index) => {                                                        
                            return <PeopleItem clickFunc={() => handleOpenChat(x.chatId, x.userss, x.yourRole, x.isSeen)} isSeen={x.isSeen} userId={x.userss.uid} key={x.chatId} chatID={x.chatId} img={x.userss.photoURL} name={x.yourRole == "student"? `Student ${index + 1}`: x.userss.displayName} lastMessage={x.lastMessage}></PeopleItem>
                        })
                    }
                </div>
            </div>
        )
    
}