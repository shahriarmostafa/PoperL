import { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import AgoraRTC from "agora-rtc-sdk-ng";
import Swal from "sweetalert2";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "./AuthProvider";
import WhiteboardCall from "../interfaces/Private/Shared/WhiteBoard/WhiteBoardCall";




export const CallContext = createContext();


export default function CallProvider({children}){

    const [showWhiteboard, setShowWhiteboard] = useState(false); // State to control whiteboard visibility
    const [channel, setChannel] = useState(null);

    const {user} = useContext(AuthContext)
    const UID = user?.uid;

    //basic agora data
    const rtc = {
        localAudioTrack: null,
        client: null, // AgoraRTC client object
    };
    
    const AGORA_APP_ID = "ed128ef97bbd4d7c9c59b9ec7e4f1372";

    useEffect(() => {
        if(!UID) return;
        initializeClient();
        listenForCalls(UID);


    }, [UID]);

    function initializeClient() {
        if (rtc.client) {
            console.warn("AgoraRTC client already initialized.");
            return; // Prevent re-initialization
        }
    
        rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    
        rtc.client.on("user-published", async (user, mediaType) => {
            await rtc.client.subscribe(user, mediaType);
            console.log("Subscribe success");
    
            if (mediaType === "audio") {
                user.audioTrack.play();
            }
        });
    
        rtc.client.on("user-unpublished", async (user) => {
            await rtc.client.unsubscribe(user);
        });
    }
    

    const listenForCalls = (userId) => {
            if(!userId ) return;
            const callDocRef = doc(db, "calls", userId);
        
            return onSnapshot(callDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const callData = docSnapshot.data();
        
                    if (callData.status === "ringing") {
                        Swal.fire({
                            title: `Incoming call from someone`,
                            showCancelButton: true,
                            confirmButtonText: "Accept",
                            cancelButtonText: "Reject",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                acceptCall(callData);                                
                            } else {
                                rejectCall(userId);
                            }
                        });
                    }
                }
            });
        };

        

    const acceptCall = async (callData) => {
            try {
                await joinChannel(callData.channelName, callData.agoraToken, callData.uid);
                await setDoc(doc(db, "calls", callData.callerId), { status: "accepted" }, { merge: true });
        
                listenForCallEnd(callData.callerId); // Listen for call termination
        
                Swal.fire({
                    title: "In call...",
                    showCancelButton: true,
                    confirmButtonText: "End Call",
                    cancelButtonText: "Open Whiteboard",
                    allowOutsideClick: false,
                }).then(async (result) => { 
                    if (result.isConfirmed) {                         
                        await leaveChannel(callData.uid);
                        
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        await setDoc(doc(db, "whiteboard", callData.channelName), { whiteboardOpen: true }, { merge: true });
                        setShowWhiteboard(true);
                    }
                });
                
        
            } catch (error) {
                console.error("Error accepting call:", error);
                Swal.fire("Error", "Something went wrong while joining the call.", "error");
            }
    };


    // Reject the call
    const rejectCall = async (receiverId) => {
        await setDoc(doc(db, "calls", receiverId), { status: "rejected" }, { merge: true });
    };


    const listenForCallEnd = (userId) => {
        const callRef = doc(db, "calls", userId);
        return onSnapshot(callRef, async (docSnapshot) => {
            if (docSnapshot.exists() && docSnapshot.data().status === "ended") {
                // Show alert that the call ended
                Swal.fire("Call Ended", "The other user has left the call.", "info");
    
                // Stop local audio and leave the channel
                if (rtc.localAudioTrack) {
                    rtc.localAudioTrack.close();
                }
                if (rtc.client) {
                    await rtc.client.leave();
                }
    
                // Optional: Remove call entry from Firestore
                await deleteDoc(callRef);
            }
        });
    };

    async function joinChannel(channelName, token, uid) {
        setChannel(channelName);
        if (rtc.client.connectionState !== "DISCONNECTED") {
            console.warn("Already connected to a channel. Leaving current channel first...");
            await leaveChannel(UID);  // Leave the existing call first
        }
        try {
            await rtc.client.join(AGORA_APP_ID, channelName, token, uid);
            await publishLocalAudio();
            console.log("Joined channel:", channelName);
        } catch (error) {
            console.error("Error joining channel:", error);
        }
    }

    // Publish local audio
    async function publishLocalAudio() {
        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await rtc.client.publish([rtc.localAudioTrack]);
    }

    // Leave the call
        async function leaveChannel(userId) {
            if (!userId || typeof userId !== "string") {
                console.error("Invalid userId:", userId);
                return;
            }

            

        
            if (rtc.localAudioTrack) {
                rtc.localAudioTrack.close();
            }
        
            await rtc.client.leave();
            console.log("Left the call.");
        
            // Update Firestore safely
            try {
                await setDoc(doc(db, "calls", userId), { status: "ended" }, { merge: true });
                console.log("Call status updated to ended.");
            } catch (error) {
                console.error("Error updating Firestore call status:", error);
            }
        
            Swal.fire("Call Ended", "You have left the call.", "info");
        }



    const callContextUtility = {
        joinChannel,
        listenForCallEnd,
        leaveChannel,
        setShowWhiteboard
    }

    return (
        <CallContext.Provider value={callContextUtility}>
            {children}
            {/* Conditionally render the WhiteboardCall component */}
      {showWhiteboard && <WhiteboardCall channelName={channel} />}
        </CallContext.Provider>
    )
}