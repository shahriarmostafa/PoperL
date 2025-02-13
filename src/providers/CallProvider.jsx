import { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import AgoraRTC from "agora-rtc-sdk-ng";
import Swal from "sweetalert2";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "./AuthProvider";
import WhiteBoard from "../interfaces/Private/Shared/WhiteBoard/WhiteBoardCall";
import axios from "axios";
// import CallUI from "../interfaces/Private/Shared/CallUi/CallUi"

export const CallContext = createContext();

export default function CallProvider({ children }) {

  const [showWhiteboard, setShowWhiteboard] = useState(false); // Manage whiteboard visibility
  const [channel, setChannel] = useState(null);

  const [UUID, setUUID] = useState(null);

  const { user } = useContext(AuthContext);
  const UID = user?.uid;

  // Basic Agora data
  const rtc = {
    localAudioTrack: null,
    client: null, // AgoraRTC client object
  };



  //create whiteboard room for users
  const getWhiteBoardRoomUUID = async () => {
    console.log("Called");
    
    try {
      const response = await axios.post("http://localhost:5000/create-whiteboard-room", {
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching whiteboard token:", error);
      return null;
    }
  };






  const AGORA_APP_ID = "ed128ef97bbd4d7c9c59b9ec7e4f1372";

  useEffect(() => {
    if (!UID) return;
    initializeClient();
    listenForCalls(UID);
  }, [UID]);

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

  const listenForCalls = (userId) => {
    if (!userId) return;
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

      listenForCallEnd(UID);

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
        Swal.fire("Call Ended", "The other user has left the call.", "info");

        if (rtc.localAudioTrack) {
          rtc.localAudioTrack.close();
        }
        if (rtc.client) {
          await rtc.client.leave();
        }

      }
    });
  };

  async function joinChannel(channelName, token, uid) {
    setChannel(channelName);
    if (rtc.client.connectionState !== "DISCONNECTED") {
      await leaveChannel(UID);  // Leave the existing call first
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
    if (!userId) return;

    if (rtc.localAudioTrack) {
      rtc.localAudioTrack.close();
    }

    await rtc.client.leave();

    await setDoc(doc(db, "calls", userId), { status: "ended" }, { merge: true });
    Swal.fire("Call Ended", "You have left the call.", "info");
  }

  const callContextUtility = {
    joinChannel,
    listenForCallEnd,
    leaveChannel,
    setShowWhiteboard,
    showWhiteboard, // Provide state here to manage whiteboard visibility
    setUUID,
    getWhiteBoardRoomUUID
  };
  
  return (
    <CallContext.Provider value={callContextUtility}>
    {children}
    {showWhiteboard && UUID && <WhiteBoard UUID={UUID} />}
    {/* <CallUI callerName={"Karim"}></CallUI> */}
  </CallContext.Provider>
  );
}
