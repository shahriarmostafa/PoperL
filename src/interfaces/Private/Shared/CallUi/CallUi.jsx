import { useState, useEffect, useContext } from 'react';
import { MdCallEnd } from 'react-icons/md';
import { CallContext } from '../../../../providers/CallProvider';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase.init';

const CallUI = ({ status, callEndingId, callData, UID}) => {

  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const callerName = status == "Ringing"? "Teacher" : "Student";

  useEffect(() => {
    if (status === "accepted" && !intervalId) {
      const id = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    }

    if (status === "ended" && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status]);


  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const {setShowWhiteboard, leaveChannel, acceptCall, rejectCall, setShowCallUi, setCallStatus} = useContext(CallContext);

  const acceptCallHandler = () => {
    stopRingtone();
    acceptCall(callData);
    setSeconds(0)
  }
  const rejectCallHandler = () => {
    stopRingtone();
    rejectCall(callEndingId);    
  }

  const endCall = async () => {
    clearInterval(intervalId);

    // Determine call points based on duration
    let callPoints = 0;
    if (seconds >= 10 && seconds < 40) callPoints = 1;   // 1-2 min
    else if (seconds >= 40 && seconds < 180) callPoints = 2;   // 1-2 min
    else if (seconds >= 180 && seconds < 300) callPoints = 5;   // 3-5 min
    else if (seconds >= 300 && seconds < 600) callPoints = 10;  // 6-10 min
    else if (seconds >= 600 && seconds < 900) callPoints = 15;  // 11-15 min
    else if (seconds >= 900 && seconds < 1200) callPoints = 20; // 16-20 min
    else if (seconds >= 1200 && seconds < 1500) callPoints = 25; // 21-25 min
    else if (seconds >= 1500) callPoints = 30; // 26-30 min

    await leaveChannel(callEndingId);

    // Update teacher's points if callPoints > 0


    
    if (callPoints > 0) {
      const teacherRef = doc(db, "teacherCollection", callEndingId);
      
      await updateDoc(teacherRef, {
          points: increment(callPoints),
      });
    }

    const studentId = UID == callEndingId? callData.callerId : UID;

    const studentRef = doc(db, "studentCollection", studentId);
    await updateDoc(studentRef, {
        "subscription.callLimit": increment(-seconds / 60), // Convert seconds to minutes
    });

  };

  const openBoard = () => {
    setShowWhiteboard(true)
  }

  const hideCallView = () => {
    setShowCallUi(false);
    setCallStatus("Ringing")
  }


  //stop ringtone
  const stopRingtone = () => {
    if (window.ringtoneAudio) {
      window.ringtoneAudio.pause();
      window.ringtoneAudio = null
    }
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
              (status !== "ringing" && status !== "Ringing") && formatTime(seconds)
            }
          </div>
          <div className="status">{status.toUpperCase() + "..."}</div>
        </div>
        {
          status === "ringing" && 
          <div className="accept-reject d-flex justify-content-center">
            <button onClick={acceptCallHandler} className="accept btn btn-primary mx-2">Accept</button>
            <button onClick={rejectCallHandler} className="reject btn btn-danger">Reject</button>
          </div> 
        }
        {
          status === "Ringing" && 
          <div className="call-actions">
            <button onClick={endCall} className="end-call-button">
              <MdCallEnd></MdCallEnd>
            </button>
          </div>
        }

        {
          status === "accepted" &&
          <div className="call-actions">
            <button onClick={endCall} className="end-call-button">
              <MdCallEnd></MdCallEnd>
            </button>
            <button onClick={openBoard} className="whiteboard-button">Show Whiteboard</button>
          </div>
        }
        
        {
          (status === "rejected" ||  status === "ended" || status === "missed") &&
          <div onClick={hideCallView} className="ok-button">
            <button className="btn btn-danger">Done</button>
          </div>
        }
        
      </div>
    </div>
  );
};

export default CallUI;