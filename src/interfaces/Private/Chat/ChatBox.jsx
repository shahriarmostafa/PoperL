import { useContext, useEffect, useRef, useState } from 'react';
import ChatTop from './ChatTop';
import IncomingMessage from './IncomingMessage';
import SentMessage from './SentMessage';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import {db} from '../../../firebase/firebase.init';
import { getChatBoxData } from '../../../Hooks/getChatBoxData';
import { AuthContext } from '../../../providers/AuthProvider';

//supabase storage data
import { createClient } from "@supabase/supabase-js";
import Swal from 'sweetalert2';

export default function ChatBox(){
    //setup of supabase storage
    const public_url = "https://ouywywipahsqnwhjrsgh.supabase.co";
    const anonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eXd5d2lwYWhzcW53aGpyc2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjAwMDAsImV4cCI6MjA1NDY5NjAwMH0.cnu01awFpyLQMMmTBXdKgIMLIqEnW97X62lTUCDcxGU";
    const supabase = createClient(public_url, anonkey);


    const [chats, setChats] = useState([]);
    const [lastMessageMntsAgo, setLastMessageMntsAgo] = useState(0);

    const {chatId, receiver, yourRole} = getChatBoxData();
    
    const {user} = useContext(AuthContext);

    const endRef = useRef(null);
    const inputRef = useRef(null);


    // scroll to bottom for new message
    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [chats]);


    //last message mnts ago view
    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chatDB", chatId), (res)=> {
            setChats(res.data());
            const lastMessageIndex = res.data().messages.length - 1;
            const createdAtValue = res.data().messages[lastMessageIndex].createdAt;
            const mntsAgoValue = Math.floor((Date.now() - createdAtValue)/ 60000);
            setLastMessageMntsAgo( mntsAgoValue );
        })

        return () => {
            unSub()
        }
    }, [chatId]);

    //resize image
    const resizeImage = (file, maxWidth = 1000, maxHeight = 1000) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
    
            reader.onload = () => {
                img.onload = () => {
                    // Create a canvas and set the desired width and height
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
    
                    let width = img.width;
                    let height = img.height;
    
                    // Calculate the new size, keeping the aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
    
                    // Set the canvas size to the new dimensions
                    canvas.width = width;
                    canvas.height = height;
    
                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0, width, height);
    
                    // Convert the canvas back to a file
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, {
                                type: file.type,
                            });
                            resolve(resizedFile);
                        } else {
                            reject("Failed to resize image");
                        }
                    }, file.type);
                };
    
                img.src = reader.result;
            };
    
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };


    //download image
    const downloadImage = (image) => { 
        Swal.fire({

            imageUrl: image,
            imageWidth: 300,
            imageAlt: "Custom image",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Download"
          }).then((result) => {
            if (result.isConfirmed) {
                const link = document.createElement('a');
                link.href = image;
                link.target = '_blank';
                link.download = 'image.jpg'; // You can set the filename as you prefer
                link.click();
              Swal.fire({
                title: "Downloaded!",
                icon: "success"
              });
            }
          });;
    }
    


    //basic setup
    const handleInputChange = async (event) => {
        event.preventDefault();
        event.target.message.focus();
        const text = event.target.message.value;
        const imageFile = event.target.image.files[0] ? event.target.image.files[0] : null;
        event.target.message.value = '';
        event.target.image.value = '';
        if (imageFile) {
            try {
                // Resize the image before uploading
                const resizedImage = await resizeImage(imageFile);
    
                // Send resized image to Supabase
                handleMessageSend(text, resizedImage);
            } catch (error) {
                handleMessageSend(text, null);
                alert("Something wrong with image:");
                console.log(error);
            }
        } else {
            handleMessageSend(text, null); // Send message without image
        }
        
    };
    
    //sendint message
    // const handleMessageSend = async(text, image) => {
    //     const message = text;
    //     if(message.trim() == ''){
    //         console.log("Empty message");
    //         return  
    //     }
    //     if (inputRef.current) {
    //         inputRef.current.value = '';
    //       }
    //     endRef.current?.scrollIntoView({behavior: 'smooth'});
    //     try{
    //         await updateDoc(doc(db, "chatDB", chatId), {
    //             messages: arrayUnion({
    //                 senderId: user.uid,
    //                 text: message,
    //                 createdAt: Date.now()

    //             })
    //         });
    //         const userIds = [user.uid, receiver.uid];
    //         userIds.forEach(async(id) => {
    //             const userChatRef = doc(db, "chatCollection", id);
    //             const userChatData = await getDoc(userChatRef);
    //             if(userChatData.exists()){
    //                 const finalData = userChatData.data();
    //                 const chatIndex = finalData.chats.findIndex(eachData => eachData.chatId === chatId);
    //                 finalData.chats[chatIndex].lastMessage = message;
    //                 finalData.chats[chatIndex].isSeen = (id === user.uid) ? true : false;
    //                 finalData.chats[chatIndex].updatedAt = Date.now();
    //                 await updateDoc(userChatRef, {
    //                     chats: finalData.chats
    //                 });
    //             }
    //         })            
    //     }
    //     catch(err){
    //         console.log(err);
            
    //     }
    //     inputRef.current.focus();
    // }

    //sending message

    const handleMessageSend = async(text, image) => {
        let imgUrl = null;

        if(image){
            const fileName = `${Date.now()}_${image.name}`;
            const {data, error} = await supabase.storage.from("poperl_chat_data").upload(fileName, image, {
                cacheControl: 'public, max-age=3600',
                upsert: false,
            });

            if(error){
                console.log(error);
                return;
            }
            imgUrl = `https://ouywywipahsqnwhjrsgh.supabase.co/storage/v1/object/public/poperl_chat_data/${fileName}`;
        }
        if(!text.trim() && !imgUrl){
            return;
        }
        endRef.current?.scrollIntoView({ behavior: "smooth" });

        try {
            await updateDoc(doc(db, "chatDB", chatId), {
                messages: arrayUnion({
                    senderId: user.uid,
                    ...(text &&  {text: text}), // Save text message
                    createdAt: Date.now(),
                    ...(imgUrl &&  {imageUrl: imgUrl})
                }),
            });
    
            const userIds = [user.uid, receiver.uid];
            userIds.forEach(async (id) => {
                const userChatRef = doc(db, "chatCollection", id);
                const userChatData = await getDoc(userChatRef);
                if (userChatData.exists()) {
                    const finalData = userChatData.data();
                    const chatIndex = finalData.chats.findIndex(eachData => eachData.chatId === chatId);
                    finalData.chats[chatIndex].lastMessage = text || "📷 Image";
                    finalData.chats[chatIndex].isSeen = id === user.uid ? true : false;
                    finalData.chats[chatIndex].updatedAt = Date.now();
                    await updateDoc(userChatRef, {
                        chats: finalData.chats
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
        inputRef.current.focus();

    }
         
    

    return (
        <div className="chat-page">
            <section className="chat night-view">
                    <div className="chat-box">
                        <ChatTop userName={yourRole !="teacher"? "Student" : receiver?.displayName} profileImg={receiver?.photoURL}></ChatTop>
                        <div className="container conversation">
                            <div className="all-message">
                                {
                                    chats?.messages?.map((chat, index)=>{
                                        const isFirstInGroup = index === 0 || chats.messages[index - 1]?.senderId !== chat.senderId;
                                            const isLastInGroup = index === chats.messages.length - 1 || chats.messages[index + 1]?.senderId !== chat.senderId;
                                        if(chat.senderId === user.uid) return <SentMessage viewImage={downloadImage} message={chat.text} image={chat.imageUrl} key={chat.createdAt} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup}></SentMessage>
                                        return <IncomingMessage viewImage={downloadImage} message={chat.text} key={chat.createdAt} image={chat.imageUrl} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup}></IncomingMessage>
                                    })
                                }
                                <div className="last-message">
                                    <span> {lastMessageMntsAgo < 1? "Just Now": `${lastMessageMntsAgo}m`} </span>
                                </div>
                            </div>
                            <div ref={endRef}></div>
                        </div>


                        {/* type message */}
                        <div className="typing-area d-flex justify-content-center">
                            <form method='post' className='d-flex' onSubmit={handleInputChange}>
                                <div className="select-image d-flex">
                                <input type="file" accept="image/*" id="file-input" name='image' className="file-input" style={{ display: 'none' }} />
                                    <label htmlFor="file-input">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
                                        </svg>
                                    </label>
                                </div>
                                {/* <div className="select-video d-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                                </div> */}
                                <div className="voice-message d-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/></svg>
                                </div>
                                <div className="inbox d-flex">
                                    <input autoComplete="off" ref={inputRef} name="message" type="text" placeholder="Enter your message here..."></input>
                                </div>
                                <input value="->"  type="submit" tabIndex="-1" className='send'></input>                                    
                            </form>
                        </div>
                    </div>
                </section>
        </div>
            
    )
}