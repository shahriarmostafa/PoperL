import { useState, useEffect, useContext } from 'react';
import { MdCallEnd } from 'react-icons/md';
import { CallContext } from '../../../../providers/CallProvider';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase.init';
import {setTeacherFeedback} from "../../../../Hooks/setTeacherFeedBack"
import { useNavigate } from 'react-router-dom';
// const CallUI = ({ status, callEndingId, UID}) => {
  const CallUI = () => {

    const {setShowWhiteboard, acceptCall, rejectCall, setShowCallUi, setCallStatus, callData,
    UID,
    callStatus,
    callLeavingUID, leaveChannel} = useContext(CallContext);

  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [disabledReview, setDisabledReview] = useState(false);
  const callerName = callStatus == "Ringing"? "Teacher" : "Student";

  useEffect(() => {
    if (callStatus === "accepted" && !intervalId) {
      const id = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    }

    if (callStatus === "ended" && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [callStatus]);


  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  

  

  const acceptCallHandler = () => {
    stopRingtone();
    acceptCall(callData);
    setSeconds(0)
  }
  const rejectCallHandler = () => {
    stopRingtone();
    rejectCall(callLeavingUID);    
  }

  const endCall = async () => {
    clearInterval(intervalId);

    // Determine call points based on duration
    let callPoints = 0;
    if (seconds >= 10 && seconds < 40) callPoints = 1;   // 1-2 min
    else if (seconds >= 40 && seconds < 180) callPoints = 2;   // 1-2 min
    else if (seconds >= 180 && seconds < 300) callPoints = 3;   // 3-5 min
    else if (seconds >= 300 && seconds < 600) callPoints = 5;  // 6-10 min
    else if (seconds >= 600 && seconds < 900) callPoints = 8;  // 11-15 min
    else if (seconds >= 900 && seconds < 1200) callPoints = 12; // 16-20 min
    else if (seconds >= 1200 && seconds < 1500) callPoints = 15; // 21-25 min
    else if (seconds >= 1500) callPoints = 20; // 26-30 min

    leaveChannel(callLeavingUID);

    // Update teacher's points if callPoints > 0


    
    if (callPoints > 0) {
      const teacherRef = doc(db, "teacherCollection", callLeavingUID);
      
      await updateDoc(teacherRef, {
          points: increment(callPoints),
      });
    }

    const studentId = UID == callLeavingUID? callData.callerId : UID;

    const studentRef = doc(db, "studentCollection", studentId);
    await updateDoc(studentRef, {
        "subscription.callLimit": increment(-seconds / 60), // Convert seconds to minutes
    });

    

  };

  const openBoard = () => {
    setShowWhiteboard(true)
  }

  const hideCallView = () => {
    navigate("/user/chat")
    setCallStatus("Ringing");
  }


  //stop ringtone
  const stopRingtone = () => {
    if (window.ringtoneAudio) {
      window.ringtoneAudio.pause();
      window.ringtoneAudio = null
    }
  };

  //review for teacher
  const handleLike = () => {
    setDisabledReview(true);
    setTeacherFeedback(callLeavingUID, true, null, null);
  
  };
  const handleDislike = () => {
    setDisabledReview(true)
    setTeacherFeedback(callLeavingUID, false, null, null)
  };


  return (
    <div className="call-ui-container">
      <div className="call-card">
        <div className="top">
          <div className="call-header">In Call With</div>
          <div className="caller-name">{callerName}</div>
        </div>
        <div className="center">
          <div className="call-duration">
            {
              (callStatus !== "ringing" && callStatus !== "Ringing") && formatTime(seconds)
            }
          </div>
          <div className="status">{callStatus + "..."}</div>
        </div>
        {
          callStatus === "ringing" && 
          <div className="accept-reject d-flex justify-content-center">
            <button onClick={acceptCallHandler} className="accept btn btn-primary mx-2">Accept</button>
            <button onClick={rejectCallHandler} className="reject btn btn-danger">Reject</button>
          </div> 
        }
        {
          callStatus === "Ringing" && 
          <div className="call-actions">
            <button onClick={endCall} className="end-call-button">
              <MdCallEnd></MdCallEnd>
            </button>
          </div>
        }

        {
          callStatus === "accepted" &&
          (<>
            {
              callLeavingUID != UID && (
                <div className="feedback  my-2">
                  <h3 className='text-center'>Add a Review?</h3>
                  <button onClick={handleLike} className="dislike btn btn-success mx-1" disabled={disabledReview}>Good Teacher</button>
                  <button onClick={handleDislike} className="love btn btn-danger" disabled={disabledReview}>Not Good</button>
                  {disabledReview && <h5 className='text-success'>Thanks for adding a review</h5>}
                </div>
              )
            }
            <div className="call-actions">
              <button onClick={endCall} className="end-call-button">
                <MdCallEnd></MdCallEnd>
              </button>
              <button onClick={openBoard} className="whiteboard-button">Show Whiteboard</button>
            </div>
          </>
          
          )
        }
        
        {
          (callStatus === "rejected" ||  callStatus === "ended" || callStatus === "missed") &&
          <div onClick={hideCallView} className="ok-button">
            <button className="btn btn-danger">Done</button>
          </div>
        }
        
      </div>
    </div>
  );
};

export default CallUI;