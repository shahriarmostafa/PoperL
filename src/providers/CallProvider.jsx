import { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import AgoraRTC from "agora-rtc-sdk-ng";
import Swal from "sweetalert2";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "./AuthProvider";
import WhiteBoard from "../interfaces/Private/Shared/WhiteBoard/WhiteBoardCall";
import CallUI from "../interfaces/Private/Shared/CallUi/CallUi";
import useAxiosSecure from "../Hooks/useAxiosSecure";

export const CallContext = createContext();

export default function CallProvider({ children }) {

  const [showWhiteboard, setShowWhiteboard] = useState(false); // Manage whiteboard visibility
  const [channel, setChannel] = useState(null);

  const { user } = useContext(AuthContext);
  const UID = user?.uid;


  const axiosSecure = useAxiosSecure();


  //call ui setup
  const [showCallUi , setShowCallUi] = useState(false);
  const [callLeavingUID, setCallLeavingUID] = useState("");
  const [callStatus, setCallStatus] = useState("Ringing");
  const [callData, setCallData] = useState(null);
  // const [callTimeoutId, setCallTimeoutId] = useState(null);

  let callTimeoutId;

  const startTimeout = (uid) => {
    callTimeoutId = setTimeout(async () => {        
      if (callStatus === "Ringing") { 
        await setDoc(doc(db, "calls", uid), { status: "missed" }, { merge: true });
        if (window.ringtoneAudio) {
          window.ringtoneAudio.pause();
          window.ringtoneAudio = null
        }
        setCallStatus("missed");
  
        if (rtc.localAudioTrack) {
          rtc.localAudioTrack.close();
        }
        if (rtc.client) {
          await rtc.client.leave();
        }
      }
    }, 40000);
  };


  
  


  




//play ringtone for call
const playRingtone = () => {
  if (!window.ringtoneAudio) {
    window.ringtoneAudio = new Audio("/ringtone.mp3");
    window.ringtoneAudio.play().catch((e) => console.error("Auto-play blocked:", e));
  }
};






  //whiteboard uuid
  const [UUID, setUUID] = useState(null);



  // Basic Agora data
  const rtc = {
    localAudioTrack: null,
    client: null, // AgoraRTC client object
  };



  //create whiteboard room for users
  const getWhiteBoardRoomUUID = async () => {
    console.log("Called");
    
    try {
      const response = await axiosSecure.post("/create-whiteboard-room", {
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching whiteboard token:", error);
      return null;
    }
  };






  const AGORA_APP_ID = "ed128ef97bbd4d7c9c59b9ec7e4f1372";



  //for future

  // useEffect(() => {
  //   if (!UID) return;
    
  //   const handleVisibilityChange = async () => {
  //     if (document.hidden && callStatus === "Ringing") {
  //       console.log("User switched screen during ringing, marking as missed...");
  //       await setDoc(doc(db, "calls", UID), { status: "missed" }, { merge: true });
  //       setCallStatus("missed");
  //     }
  //   };
  
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [UID, callStatus]);
  // useEffect(() => {
  //   const handleAppExit = async () => {
  //     if (callStatus === "ringing") {
  //       console.log("App closed or refreshed during ringing, marking as missed...");
  //       await setDoc(doc(db, "calls", UID), { status: "missed" }, { merge: true });
  //       setCallStatus("missed");
  //     }
  //   };
  
  //   window.addEventListener("beforeunload", handleAppExit);
  
  //   return () => {
  //     window.removeEventListener("beforeunload", handleAppExit);
  //   };
  // }, [UID, callStatus]);
  
  

  

  function initializeClient() {
    if (rtc.client) {
      console.warn("AgoraRTC client already initialized.");
      return;
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



  // Updated UI to open whiteboard from context
    const startAudioCallUI = (channelName, token, uid) => {

      setCallStatus("Ringing")
      listenForCallReceive(uid);
      joinChannel(channelName, token, uid);



      if (!window.ringtoneAudio) {
        window.ringtoneAudio = new Audio("/ringbacktone.mp3");
        window.ringtoneAudio.play().catch((e) => console.error("Auto-play blocked:", e));
      }

      startTimeout(uid); // Starts the timeout
      };

  

  const acceptCall = async (callData) => {
    try {
      await joinChannel(callData.channelName, callData.agoraToken, callData.uid);
      const callRef = doc(db, "calls", UID);

      // Fetch the document to check the current `uuid`
      const docSnap = await getDoc(callRef);

      // Check if the document exists and if `uuid` is null or undefined
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.uuid) {
          // If `uuid` is null or undefined, get the new UUID
          const createWhiteBoardRoom = await getWhiteBoardRoomUUID();
          const UUID = createWhiteBoardRoom.uuid;
          setUUID(UUID);
          // Update the document with the new UUID
          await setDoc(callRef, { uuid: UUID }, { merge: true });
        }
        else{
          setUUID(data.uuid)
        }
      }

      await setDoc(doc(db, "calls", UID), { status: "accepted" }, { merge: true });

      //set call status
      setCallStatus("accepted");
      listenForCallEnd(UID);

    } catch (error) {
      console.error("Error accepting call:", error);
      Swal.fire("Error", "Something went wrong while joining the call.", "error");
    }
  };

  // Reject the call
  const rejectCall = async (receiverId) => {
    await setDoc(doc(db, "calls", receiverId), { status: "rejected" }, { merge: true });
    setCallStatus("rejected");
  };


  const listenForCalls = (userId) => {
    if (!userId) return;
    setCallLeavingUID(userId);
    const callDocRef = doc(db, "calls", userId);

    return onSnapshot(callDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const callData = docSnapshot.data();

        if (callData.status === "ringing") {
          listenForCallEnd(UID);
          setCallStatus("ringing");
          setCallData(callData);
          setShowCallUi(true);
          playRingtone();

        }
      }
    });
  };

  useEffect(() => {
    if (!UID) return;
    initializeClient();
    listenForCalls(UID);
  }, [UID]);


  const listenForCallEnd = (userId) => {
    const callRef = doc(db, "calls", userId);
    return onSnapshot(callRef, async (docSnapshot) => {
      if (docSnapshot.exists() && docSnapshot.data().status === "ended") {
        setCallStatus("ended");
        if (window.ringtoneAudio) {
          window.ringtoneAudio.pause();
          window.ringtoneAudio.currentTime = 0;
          window.ringtoneAudio = null;
          
        }
        if (rtc.localAudioTrack) {
          rtc.localAudioTrack.close();
        }
        if (rtc.client) {
          await rtc.client.leave();
        }

      }
      if (docSnapshot.exists() && docSnapshot.data().status === "missed") {
        if (window.ringtoneAudio) {
          window.ringtoneAudio.pause();
          window.ringtoneAudio.currentTime = 0;
          window.ringtoneAudio = null
        }
        setCallStatus("missed");
      }
    });
  };

  const listenForCallReceive = (userId) => {
    const callRef = doc(db, "calls", userId);
    return onSnapshot(callRef, async(docSnapshot) => {
      if(docSnapshot.exists() && docSnapshot.data().status === "accepted"){
        if (window.ringtoneAudio) {
          window.ringtoneAudio.pause();
          window.ringtoneAudio = null
        }
        setCallStatus("accepted");
         clearTimeout(callTimeoutId); // Stop the timeout
      }
      if(docSnapshot.exists() && docSnapshot.data().status === "rejected"){
        if (window.ringtoneAudio) {
          window.ringtoneAudio.pause();
          window.ringtoneAudio = null
        }
        setCallStatus("rejected");
        clearTimeout(callTimeoutId); // Stop the timeout
        if (rtc.localAudioTrack) {
          rtc.localAudioTrack.close();
        }
        if (rtc.client) {
          await rtc.client.leave();
        }
      }
    })
  }

  async function joinChannel(channelName, token, uid) {
    if(!rtc.client){
      initializeClient();
    }
    setChannel(channelName);
    if (rtc.client.connectionState !== "DISCONNECTED") {
      await leaveChannel(uid);  // Leave the existing call first
    }
    try {
      await rtc.client.join(AGORA_APP_ID, channelName, token, uid);
      await publishLocalAudio();
      
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
    console.log("called");
    if (!userId) return;

    if (rtc.localAudioTrack) {
      rtc.localAudioTrack.close();
    }
    
    if(!rtc.client){
      initializeClient()
    }

    await rtc.client.leave();

    await setDoc(doc(db, "calls", userId), { status: "ended" }, { merge: true });
  }

  //share data to pages through context
  const callContextUtility = {
    startAudioCallUI,
    joinChannel,
    listenForCallEnd,
    leaveChannel,
    setShowWhiteboard,
    showWhiteboard, // Provide state here to manage whiteboard visibility
    setUUID,
    getWhiteBoardRoomUUID,
    setShowCallUi,
    setCallLeavingUID,
    acceptCall,
    rejectCall,
    setCallStatus
  };
  
  return (
    <CallContext.Provider value={callContextUtility}>
    {children}
    {showWhiteboard && UUID && <WhiteBoard UUID={UUID} />}
    {showCallUi && <CallUI UID={UID} callData={callData} status={callStatus} callEndingId={callLeavingUID}></CallUI>}
  </CallContext.Provider>
  );
}
