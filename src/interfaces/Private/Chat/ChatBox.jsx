import { useContext, useEffect, useRef, useState } from 'react';
import ChatTop from './ChatTop';
import IncomingMessage from './IncomingMessage';
import SentMessage from './SentMessage';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import {db} from '../../../firebase/firebase.init';
import { getChatBoxData } from '../../../Hooks/getChatBoxData';
import { AuthContext } from '../../../providers/AuthProvider';
import voiceMessageGiff from '../../../assests/frequency-17048_128.gif';


//supabase storage data
import { createClient } from "@supabase/supabase-js";

//tools
import Swal from 'sweetalert2';
import { resizeImage } from '../../../providers/ImageResizer';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import ImagePopUp from './ImagePopUp';

export default function ChatBox(){
    //setup of supabase storage
    const public_url = "https://ouywywipahsqnwhjrsgh.supabase.co";
    const anonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eXd5d2lwYWhzcW53aGpyc2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjAwMDAsImV4cCI6MjA1NDY5NjAwMH0.cnu01awFpyLQMMmTBXdKgIMLIqEnW97X62lTUCDcxGU";
    const supabase = createClient(public_url, anonkey);

    //api's
    const axiosSecure = useAxiosSecure();


    //chat informations
    const [chats, setChats] = useState([]);
    const [lastMessageMntsAgo, setLastMessageMntsAgo] = useState(0);
    const {chatId, receiver, yourRole} = getChatBoxData();

    //auth infromations
    const {user} = useContext(AuthContext);







    


    
    

    //sending nottification
    const sendNottification = async (nottificationMessage, nottificationToken, senderName) => {
        if(!nottificationToken || ! nottificationMessage || !senderName){
            console.log("FCM and token not found");
            return;
        }
        await axiosSecure.post("/send-notification", { senderName, nottificationToken, nottificationMessage });
        
    }




    
    
    
    
    

    //chat control
    const endRef = useRef(null);
    const inputRef = useRef(null);
    const [uploadingImg, setUploadingImg] = useState(false);

    // scroll to bottom for new message
    useEffect(() => {
        endRef.current?.scrollIntoView({behavior: 'smooth'});

    }, [chats, uploadingImg]);


    //last message mnts ago view
    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chatDB", chatId), (res)=> {
            setChats(res.data());
            const lastMessageIndex = res.data().messages.length - 1;
            const createdAtValue = res.data().messages[lastMessageIndex].createdAt;
            const mntsAgoValue = Math.floor((Date.now() - createdAtValue)/ 60000);
            setLastMessageMntsAgo( mntsAgoValue );
        });

        

        return () => {
            unSub()
        }
    }, [chatId]);

    //resize image
    


    //download image
    const downloadImage = (image) => { 
        Swal.fire({
            icon: "download",
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

    //send voice message
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

function getDuration(audioBlob) {
    return new Promise((resolve) => {
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);

        audio.addEventListener("loadedmetadata", () => {
            if (audio.duration === Infinity || isNaN(audio.duration)) {
                // Fallback method for Chrome
                audio.currentTime = 100000000; // Seek far ahead
                audio.addEventListener("timeupdate", function onTimeUpdate() {
                    audio.removeEventListener("timeupdate", onTimeUpdate);
                    resolve(audio.duration);
                });
            } else {
                resolve(audio.duration);
            }
        });

        audio.addEventListener("error", () => {
            resolve(0); // Return 0 if there's an error
        });

        // Set the source and load metadata
        audio.src = audioURL;
        audio.load();
    });
}



const startRecording = async () => {
    setIsRecording(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        let chunks = [];
        let startTime = Date.now();

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            stream.getTracks().forEach(track => track.stop()); // ✅ Stop the mic stream

            const duration = await getDuration(audioBlob);

            const result = await Swal.fire({
                title: "Send Voice Message?",
                text: `Duration: ${duration} seconds`,
                showCancelButton: true,
                confirmButtonText: "Send",
                cancelButtonText: "Cancel"
            });
        
            if (result.isConfirmed) {
                
                await sendVoiceMessage(audioBlob, duration); // Only send if confirmed
            } else {
                console.log("Voice message canceled");
            }
        };

        setMediaRecorder(recorder);
        recorder.start();

        

        let swalInterval = setInterval(() => {
            let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            Swal.update({
                text: `Recording... ⏳ ${elapsedTime}s`,
            });
        }, 1000);

        Swal.fire({
            text: "Recording... ⏳ 0s",
            imageUrl: voiceMessageGiff,
            imageWidth: 100,
            imageAlt: "Recording Voice...",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "STOP",
            allowOutsideClick: false,
        }).then(async (result) => {
            clearInterval(swalInterval);

            if (result.isConfirmed) {
                recorder.stop();
            } else {
                recorder.stop();
            }
        });

    } catch (error) {
        console.error("Error starting recording:", error);
        setIsRecording(false);
    }
};







    const sendVoiceMessage = async (newBlob, duration) => {
        if (!newBlob) return;
    
        const fileName = `${Date.now()}.webm`;
        const file = new File([newBlob], fileName, { type: "audio/webm" });
        // ✅ Corrected Supabase upload syntax
        const { data, error } = await supabase.storage.from("poperl_chat_data").upload(fileName, file);
    
        if (error || !data) {  // ✅ Added check for null `data`
            alert("Something went wrong... Try again");
            return;
        }
    
        console.log("File path:", data.path);  // Log the path to verify
        const audioUrl = supabase.storage.from("poperl_chat_data").getPublicUrl(data.path).data.publicUrl;
        
        try {
            // ✅ Send message with audio URL
            await updateDoc(doc(db, "chatDB", chatId), {
                messages: arrayUnion({
                    audioUrl: audioUrl,
                    senderId: user.uid,
                    createdAt: Date.now()
                }),
            });
    
            const userIds = [user.uid, receiver.uid];
    
            for (const id of userIds) {  // ✅ Changed forEach to `for...of` (await works properly)
                const userChatRef = doc(db, "chatCollection", id);
                const userChatData = await getDoc(userChatRef);
                if (userChatData.exists()) {
                    const finalData = userChatData.data();
                    const chatIndex = finalData.chats.findIndex(eachData => eachData.chatId === chatId);
                    if (chatIndex !== -1) {
                        finalData.chats[chatIndex].lastMessage = "🎙️ Voice Message";
                        finalData.chats[chatIndex].isSeen = id === user.uid;
                        finalData.chats[chatIndex].updatedAt = Date.now();
                        await updateDoc(userChatRef, { chats: finalData.chats });
                    }
                }
            }



            let voicePoints = 0;

            if (duration >= 8 && duration <= 30) voicePoints = 1;
            else if (duration > 30 && duration <= 60) voicePoints = 2;
            else if (duration > 60 && duration <= 120) voicePoints = 3;
            else if (duration > 120) voicePoints = 5;

            

            // ✅ Update teacher's points in `teacherCollection`
            const teacherRef = doc(db, "teacherCollection", user?.uid);
            const teacherData = await getDoc(teacherRef);

            if (teacherData.exists()) {
                const currentPoints = teacherData.data().points;
                if(voicePoints > 0){
                    await updateDoc(teacherRef, { points: currentPoints + voicePoints });
                }
            }


            //sending notification to the user
            sendNottification("🎙️ Sent a Voice Message.", receiver?.FCMToken, user?.displayName)
    
            
        } catch (err) {
            alert("Something wrong with sending message");
        }
    
    };


    

    


    //basic setup
    const handleInputChange = async (event) => {
        event.preventDefault();
        event.target.message.focus();
        const text = event.target.message.value;
        const imageFile = event.target.image.files[0] ? event.target.image.files[0] : null;
        if (imageFile) {
            setUploadingImg(true);
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
        event.target.message.value = '';
        event.target.image.value = '';
    };
    


    //sending message

    const handleMessageSend = async(text, image) => {
        let imgUrl = null;

        if(image){
            setIsOpen(false);
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
                setUploadingImg(false);
            });

            //determining the points teacher gets

            let textPoints = 0;
            const textLength = text.trim().length;
            if (textLength > 8 && textLength <= 50) textPoints = 2;
            else if (textLength > 50 && textLength <= 150) textPoints = 4;
            else if (textLength > 150 && textLength <= 300) textPoints = 6;
            else if (textLength > 300 ) textPoints = 8;

            // Check if sender is a teacher
            const teacherRef = doc(db, "teacherCollection", user.uid);
            const teacherSnap = await getDoc(teacherRef);

            if(teacherSnap.exists()){
                let pointsToAdd = textPoints + (imgUrl? 5: 0);
                if(pointsToAdd > 0){
                    await updateDoc(teacherRef, {
                        points: (teacherSnap.data().points) + pointsToAdd
                    })
                }
            }



        } catch (err) {
            console.log(err);
        }
        inputRef.current.focus();


        sendNottification(text || "📷 Sent an Image", receiver?.FCMToken, user?.displayName);
    }


    // image modal to view before sending
    const [isOpen, setIsOpen] = useState(false);
    const [imageLink, setImageLink] = useState("");
    const imageInputRef = useRef(null);

    const imgChangeHandler = (event) => {
        const imageFile = event.target.files[0];
        setImageLink(window.URL.createObjectURL(imageFile));
        setIsOpen(true);
    }

    const closeImageModal = () => {
        setIsOpen(false)
        if(imageInputRef.current){
            imageInputRef.current.value = "";
        }
    }
         
    

    return (
            <div className="chat-page">
                <section className="chat night-view">
                    <div className="chat-box">
                        <ChatTop callerID={user?.uid} receiverRole={yourRole} receiver={receiver} channel={chatId} callerName={user?.displayName}></ChatTop>
                        <div className="container conversation">
                            <div className="all-message">
                                {
                                    chats?.messages?.map((chat, index)=>{
                                        const isFirstInGroup = index === 0 || chats.messages[index - 1]?.senderId !== chat.senderId;
                                            const isLastInGroup = index === chats.messages.length - 1 || chats.messages[index + 1]?.senderId !== chat.senderId;
                                        if(chat.senderId === user.uid) return <SentMessage viewImage={downloadImage} message={chat.text} image={chat.imageUrl} audio={chat.audioUrl} key={chat.createdAt} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup}></SentMessage>
                                        return <IncomingMessage viewImage={downloadImage} message={chat.text} audio={chat.audioUrl} key={chat.createdAt} image={chat.imageUrl} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup}></IncomingMessage>
                                    })
                                }
                                <div className="last-message">
                                    <span> {lastMessageMntsAgo < 1? "Just Now": `${lastMessageMntsAgo}m`} </span>
                                </div>
                                {
                                    uploadingImg && <div className="uploading">
                                    <span>Uploading your image...</span>
                                </div>
                                }
                                
                            </div>
                            <div ref={endRef}></div>
                        </div>

                        {
                            isOpen &&
                            <ImagePopUp 
                            imageUrl={`${imageLink}`}
                            onClose={closeImageModal}
                            ></ImagePopUp> 
                        }



                        {/* type message */}
                        <div className="typing-area d-flex justify-content-center">
                            <button onClick={startRecording} className="voice-message d-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/></svg>
                            </button>
                            <form method='post' className='d-flex' onSubmit={handleInputChange}>
                                <div className="select-image d-flex">
                                <input ref={imageInputRef} onChange={imgChangeHandler} type="file" accept="image/*" id="file-input" name='image' className="file-input" style={{ display: 'none' }} />
                                    <label htmlFor="file-input">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
                                        </svg>
                                    </label>
                                </div>
                                {/* <div className="select-video d-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                                </div> */}
                                
                                <div className="inbox d-flex">
                                    <input autoComplete="off" ref={inputRef} name="message" type="text" placeholder="Enter your message here..."></input>
                                </div>
                                <div className="transfer">
                                    <label htmlFor="send" className='send d-flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/></svg>
                                    </label>
                                    <input name="send" id="send"  type="submit" className='d-none'></input> 
                                </div>                                   
                            </form>
                        </div>
                    </div>
                </section>
            </div>
            
    )
}