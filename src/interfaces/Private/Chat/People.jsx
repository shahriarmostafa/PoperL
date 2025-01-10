import { Link, useNavigate } from "react-router-dom";
import useChatList from "../../../Hooks/useChatList";
import PeopleItem from "./PeopleItem";
import { getChatBoxData } from "../../../Hooks/getChatBoxData";


export default function People(){

    const navigate = useNavigate();

    const {changeChat} = getChatBoxData();

    const { chatList, loading, error } = useChatList();
    
    const handleOpenChat = async (chatIdTaken, receiverPerson) => {
        changeChat(chatIdTaken, receiverPerson)
        navigate(`/chat/${chatIdTaken}`);
    }

    
    
    if (loading) {
        return (
            <div className="left-side d-flex align-items-center text-center justify-content-center">
                <b className="message">Loading chats...</b>
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
                         chatList.map((x) => {                                                        
                            return <PeopleItem clickFunc={() => handleOpenChat(x.chatId, x.userss)} userId={x.userss.uid} key={x.chatId} chatID={x.chatId} img={x.userss.photoURL} name={x.userss.displayName} lastMessage={x.lastMessage}></PeopleItem>
                        })
                    }
                </div>
            </div>
        )
    
}