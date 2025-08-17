import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import AgoraRTC from "agora-rtc-sdk-ng";
import Swal from "sweetalert2";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "./AuthProvider";
import WhiteBoard from "../interfaces/Private/Shared/WhiteBoard/WhiteBoardCall";
import CallUI from "../interfaces/Private/Shared/CallUi/CallUi";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useNavigate, useNavigation } from "react-router-dom";

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


  const client = useMemo(
  () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  []
);
  // Basic Agora data
  const rtc = useRef({
  localAudioTrack: null,
  client,
}).current;

  const AGORA_APP_ID = "ed128ef97bbd4d7c9c59b9ec7e4f1372";

  useEffect(() => {
    rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    rtc.client.on('user-published', async (user, mediaType) => {
      console.log('Remote user published:', user.uid);
      await rtc.client.subscribe(user, mediaType);
      console.log('Subscribed to remote user');

      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });

    rtc.client.on('user-unpublished', user => {
      console.log('User unpublished:', user.uid);
    });

    return () => {
      // Clean up
      if (rtc.localAudioTrack) {
        rtc.localAudioTrack.stop();
        rtc.localAudioTrack.close();
      }
      if (rtc.client) {
        rtc.client.leave();
      }
    };
  }, []);

  // function initializeClient() {

  //   // rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    

  //   rtc.client.on("user-published", async (user, mediaType) => {
  //     console.log("user publishing");
  //     console.log("user publishing");
      
  //     await rtc.client.subscribe(user, mediaType);
  //     console.log("Subscribe success");

  //     if (mediaType === "audio") {
  //       user.audioTrack.play();
  //     }
  //   });

  //   rtc.client.on("user-unpublished", async (user) => {
  //     await rtc.client.unsubscribe(user);
  //   });


  //     rtc.client.on("join-channel-success", (channel, uid, elapsed) => {
  //       console.log(`✅ Joined channel ${channel} as ${uid} in ${elapsed}ms`);
  //         console.log(`✅ Joined channel ${channel} as ${uid} in ${elapsed}ms`);

  //     });


  //   rtc.client.on("connection-state-change", evt => console.log(evt));
  // }
  // useEffect(() => {
  //   initializeClient();
  // }, [])





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










  
  

  
  
  const listenForCalls = (userId) => {
    if (!userId) return;
    setCallLeavingUID(userId);
    const callDocRef = doc(db, "calls", userId);

    return onSnapshot(callDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const callData = docSnapshot.data();
        

        if (callData.status === "ringing") {
          setCallStatus("ringing");
          setCallData(callData);
          setShowCallUi(true);
          listenForCallEnd(UID);
          // playRingtone();

        }
      }
    });
  };

  const checkTeacher = async (userId) => {
    const teacherRef = doc(db, "teacherCollection", userId);
    const teacherSnap = await getDoc(teacherRef);
    if (teacherSnap.exists()) {
        return true
    }
  }



  // useEffect(() => {
  //   if (!UID) return;
  //   if(checkTeacher(UID)){
  //       listenForCalls(UID);
  //       console.log(UID);
        
  //   }
  // }, [UID]);

  





  

  const acceptCall = async (callData) => {

    console.log(callData);
    
    try {
      await joinChannel(callData.channelName);



      



      
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


  


  const listenForCallEnd = (userId) => {
    const callRef = doc(db, "calls", userId);
    console.log("called first");
    
    
    return onSnapshot(callRef, async (docSnapshot) => {
      if (docSnapshot.exists() && docSnapshot.data().status === "ended") {
        console.log("found ended");
        console.log("found ended");
        console.log("found ended");
        setCallStatus("ended");

        
        if (window.ringtoneAudio) {
          window.ringtoneAudio.pause();
          window.ringtoneAudio.currentTime = 0;
          window.ringtoneAudio = null;
          
        }
        if (rtc.localAudioTrack) {
          console.log("turned off");
          
          rtc.localAudioTrack.close();
          rtc.localAudioTrack.stop();
        }
        if (rtc.client) {
          console.log("left the chhaneel");
          console.log("left the chhanneel");
          console.log("left the chhanneel");

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

  const getAgoraToken = async (channelName) => {    
    const receiverID = "uselessdata";
    
    const response = await axiosSecure.post("/generate-token", {
      channelName,
      receiverID,
    });
    return response.data;
  };

  

  const joinChannel = async (channelName) => {
    
    try {
    const { token, uid } = await getAgoraToken(channelName);
    console.log(token);
    

      await rtc.client.join(AGORA_APP_ID, channelName, token, uid);
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await rtc.client.publish([rtc.localAudioTrack]);
      console.log('Local user published audio');
    } catch (err) {
      console.error('Error joining channel:', err);
    }
  };

  // async function joinChannel(channelName, token, uid) {
  //   // // if(!rtc.client){
  //   // //   initializeClient();
  //   // // }
  //   // setChannel(channelName);
  //   if (rtc.client.connectionState !== "DISCONNECTED") {
  //     await leaveChannel(uid);  // Leave the existing call first
  //   }

    //     console.log("Token from join channel: " + token);

    
    // try {
    //   await rtc.client.join(AGORA_APP_ID, channelName, token, uid);      
    //   await publishLocalAudio();

    // } catch (error) {
    //   console.log(token);
      
    //   console.error("Error joining channel:", error);
    // }

  //   try {

  //     await rtc.client.join(AGORA_APP_ID, channelName, token, uid);
  //     rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  //     await rtc.client.publish([rtc.localAudioTrack]);
  //     console.log('Local user published audio');
  //   } catch (err) {
  //     console.error('Error joining channel:', err);
  //   }
  // }

  // Publish local audio
  async function publishLocalAudio() {
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtc.client.publish([rtc.localAudioTrack]);
  }

  const leaveChannel = async (userId) => {
    setCallStatus("ended")
    console.log(rtc.localAudioTrack);
    
    rtc.localAudioTrack.stop();
    rtc.localAudioTrack.close();
    await rtc.client.leave();
    await setDoc(doc(db, "calls", userId), { status: "ended" }, { merge: true });
  };

  

  //share data to pages through context
  const callContextUtility = {
    joinChannel,
    listenForCallEnd,
    setShowWhiteboard,
    showWhiteboard, // Provide state here to manage whiteboard visibility
    setUUID,
    getWhiteBoardRoomUUID,
    setShowCallUi,
    setCallLeavingUID,
    acceptCall,
    rejectCall,
    setCallStatus,
    startTimeout,
    listenForCallReceive,
    UID,
    callStatus,
    callLeavingUID,
    leaveChannel,
    rtc
  };
  
  return (
    <CallContext.Provider value={callContextUtility}>
    {children}
    {showWhiteboard && UUID && <WhiteBoard UUID={UUID} />}
    {/* {showCallUi && <CallUI UID={UID} status={callStatus} callEndingId={callLeavingUID} callData={callData}></CallUI>} */}
  </CallContext.Provider>
  );
}
