import { useContext, useEffect, useRef, useState } from 'react';
import ChatTop from './ChatTop';
import IncomingMessage from './IncomingMessage';
import SentMessage from './SentMessage';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import {db} from '../../../firebase/firebase.init';
import { getChatBoxData } from '../../../Hooks/getChatBoxData';
import { AuthContext } from '../../../providers/AuthProvider';

export default function ChatBox(){
    const [chats, setChats] = useState([]);
    const {chatId, receiver} = getChatBoxData();
    
    const {user} = useContext(AuthContext);

    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: 'smooth'})
    }, []);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chatDB", chatId), (res)=> {
            setChats(res.data())
        })

        return () => {
            unSub()
        }
    }, [chatId])
    
    
    const handleMessageSend = async(e) => {
        e.preventDefault();
        const message = e.target.message.value;
        if(message == ''){
            console.log("Empty message");
            return  
        }
        e.target.message.value = '';

        try{
            await updateDoc(doc(db, "chatDB", chatId), {
                messages: arrayUnion({
                    senderId: user.uid,
                    text: message,
                    createdAt: Date.now()

                })
            });

            const userIds = [user.uid, receiver.uid];

            userIds.forEach(async(id) => {
                const userChatRef = doc(db, "chatCollection", id);
                const userChatData = await getDoc(userChatRef);

                if(userChatData.exists()){
                    const finalData = userChatData.data();
                    const chatIndex = finalData.chats.findIndex(eachData => eachData.chatId === chatId);
                    finalData.chats[chatIndex].lastMessage = message;
                    finalData.chats[chatIndex].isSeen = (id === user.uid) ? true : false;
                    finalData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats: finalData.chats
                    });

                }
            })


            
        }
        catch(err){
            console.log(err);
            
        }
        
    }
        
    return (
        <div className="chat-page">
            <section className="chat night-view">
                    <div className="chat-box">
                        <ChatTop userName={receiver?.displayName || "No Name found"} profileImg={receiver?.photoURL}></ChatTop>
                        <div className="container conversation">
                            <div className="all-message">
                                {
                                    chats?.messages?.map(chat=>{
                                        if(chat.senderId == user.uid) return <SentMessage message={chat.text} key={chat.createdAt}></SentMessage>
                                        return <IncomingMessage message={chat.text} key={chat.createdAt}></IncomingMessage>
                                    })
                                }
                            </div>
                            <div className="last-message">
                                <span>1 minues ago</span>
                            </div>
                            <div ref={endRef}></div>
                        </div>
                        <div className="typing-area d-flex">
                            <div className="select-image d-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                            </div>
                            <div className="select-video d-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                            </div>
                            <div className="voice-message d-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/></svg>
                            </div>
                            <form onSubmit={handleMessageSend} className='d-flex'>
                                <div className="inbox d-flex">
                                    <input name="message" type="text" placeholder="Enter your message"></input>
                                </div>
                                <button type='submit'>                                
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
        </div>
            
    )
}