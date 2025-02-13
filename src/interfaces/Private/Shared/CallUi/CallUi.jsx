import React, { useState, useEffect, useContext } from 'react';
import { MdCallEnd } from 'react-icons/md';
import { CallContext } from '../../../../providers/CallProvider';

const CallUI = ({ status, callEndingId, callData }) => {

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

  const {setShowWhiteboard, leaveChannel, acceptCall, rejectCall, setShowCallUi} = useContext(CallContext);

  const acceptCallHandler = () => {
    acceptCall(callData);
    setSeconds(0)
  }

  const endCall = async () => {
    clearInterval(intervalId);
    await leaveChannel(callEndingId);
  };

  const openBoard = () => {
    setShowWhiteboard(true)
  }

  const hideCallView = () => {
    setShowCallUi(false)
  }


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
            <button onClick={() => rejectCall(callEndingId)} className="accept btn btn-danger">Reject</button>
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
          (status === "rejected" ||  status === "ended") &&
          <div onClick={hideCallView} className="ok-button">
            <button className="btn btn-danger">Done</button>
          </div>
        }
        
      </div>
    </div>
  );
};

export default CallUI;