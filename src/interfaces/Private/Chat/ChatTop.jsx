import { Link } from "react-router-dom";
import avatar from "../../../assests/avatar.avif";
import { db } from "../../../firebase/firebase.init";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import { CallContext } from "../../../providers/CallProvider";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function ChatTop({channel, callerID, receiver, callerName, receiverRole}) {

  const receiverID = receiver?.uid;
  const userName = receiver?.displayName;
  const profileImg = receiver?.photoURL;
  const FCMToken = receiver?.FCMToken;

  const axiosSecure = useAxiosSecure();

  //nottification information

  //sending nottification
  const sendNottification = async (nottificationToken) => {
    
      console.log(nottificationToken, callerID, callerName);
      
      if(!nottificationToken || !callerID || !callerName){
          console.log("FCM and token not found");
          return;
      }
      await axiosSecure.post("/send-call-notification", { nottificationToken, callerName, callerID });
      
  }

  const usedName = userName ? userName.split(/\s+/).slice(0, 2).join(" ") : userName;

  // Calling context info
  const {listenForCallEnd, setUUID, getWhiteBoardRoomUUID, startAudioCallUI, setShowCallUi, setCallLeavingUID } = useContext(CallContext);

  const getAgoraToken = async (channelName) => {
    const response = await axiosSecure.post("/generate-token", {
      channelName,
      receiverID,
    });
    return response.data;
  };

  const initiateCall = async (callerId, receiverId) => {

    setCallLeavingUID(receiverId);
    setShowCallUi(true);

    const studentRef = doc(db, "studentCollection", callerId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
        const studentData = studentSnap.data();
        const callLimit = studentData.subscription?.callLimit;

        if (callLimit <= 0) {
          setShowCallUi(false);
            Swal.fire("Call Limit is over", "You need to buy new package to call again", "question");
            return; // Stop execution if the limit is exceeded
        }
    } else {
        Swal.fire("Error", "Student data not found.", "error");
        return;
      }






    const channelName = channel; // Unique channel name
    const { token, uid } = await getAgoraToken(channelName);

    const callRef = doc(db, "calls", receiverId);

    // Fetch the current document to check if it exists
    const docSnap = await getDoc(callRef);

    

    if (!docSnap.exists()) {
      const gotData = await getWhiteBoardRoomUUID();
      const UUID = gotData.uuid;
      // If the document does not exist, add all data including uuid
      await setDoc(callRef, {
        callerId,
        channelName,
        agoraToken: token,
        uid,
        timestamp: Date.now(),
        status: "ringing",
        uuid: UUID// Your function to generate UUID
      });
      setUUID(UUID);
    } else {
      // If the document exists, update the fields but keep the uuid unchanged
      await setDoc(callRef, {
        callerId,
        channelName,
        agoraToken: token,
        uid,
        timestamp: Date.now(),
        status: "ringing"
      }, { merge: true }); // The merge flag ensures uuid isn't overwritten

      if(docSnap.data().uuid){
        setUUID(docSnap.data().uuid)
      }

    }

    listenForCallEnd(receiverId); // Listen for call termination
    startAudioCallUI(channelName, token, uid);

    sendNottification(FCMToken);
    
  };

  

  return (
    <div className="topper">
      <div className="container justify-content-between d-flex">
        <div className="left d-flex">
          <div className="back-btn">
            <Link to="/user/chat">
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
          {
            receiverRole == 'teacher' && (
              <div className="call-audio d-flex">
                <button onClick={() => initiateCall(callerID, receiverID)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                  </svg>
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
