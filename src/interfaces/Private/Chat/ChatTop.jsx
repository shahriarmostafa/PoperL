import { Link } from "react-router-dom";
import avatar from "../../../assests/avatar.avif";
import Swal from "sweetalert2";
import { db } from "../../../firebase/firebase.init";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { useContext, useState } from "react";
import { CallContext } from "../../../providers/CallProvider";

export default function ChatTop({ profileImg, userName, channel, callerID, receiverID }) {
  const usedName = userName ? userName.split(/\s+/).slice(0, 2).join(" ") : userName;

  // Calling context info
  const { joinChannel, listenForCallEnd, leaveChannel, setShowWhiteboard } = useContext(CallContext);


  const getAgoraToken = async (channelName) => {
    const response = await axios.post("https://backend-eta-blue-92.vercel.app/generate-token", {
      channelName,
      receiverID,
    });
    return response.data;
  };

  const initiateCall = async (callerId, receiverId) => {
    const channelName = channel; // Unique channel name
    const { token, uid } = await getAgoraToken(channelName);

    await setDoc(doc(db, "calls", receiverId), {
      callerId,
      channelName,
      agoraToken: token,
      uid,
      timestamp: Date.now(),
      status: "ringing",
    });

    listenForCallEnd(receiverId); // Listen for call termination
    startAudioCallUI(channelName, token, uid);
  };

  // Call UI with Swal
  const startAudioCallUI = (channelName, token, uid) => {
    Swal.fire({
      title: "Calling...",
      showCancelButton: true,
      confirmButtonText: "End Call",
      cancelButtonText: "Open Whiteboard",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await leaveChannel(callerID);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
        await setDoc(doc(db, "whiteboard", channelName), { whiteboardOpen: true }, { merge: true });
        // Show the whiteboard when the button is clicked
        setShowWhiteboard(true);
      }
    });

    joinChannel(channelName, token, uid);
  };

  return (
    <div className="topper">
      <div className="container justify-content-between d-flex">
        <div className="left d-flex">
          <div className="back-btn">
            <Link to="/chat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </Link>
          </div>
          <div className="user-profile mx-1">
            <img src={profileImg || avatar} alt="" />
          </div>
          <div className="userName">
            <b>{usedName}</b>
          </div>
        </div>

        <div className="right d-flex align-items-center">
          <div className="call-audio d-flex">
            <button onClick={() => initiateCall(callerID, receiverID)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
