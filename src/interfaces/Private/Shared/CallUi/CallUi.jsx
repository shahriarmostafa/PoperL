import React, { useState, useEffect } from 'react';
import { MdCallEnd } from 'react-icons/md';

const CallUI = ({ callerName, status = "Rejected" }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="call-ui-container">
      <div className="call-card">
        <div className="top">
          <div className="call-header">In Call With</div>
          <div className="caller-name">{callerName}</div>
        </div>
        <div className="center">
          <div className="call-duration">{formatTime(seconds)}</div>
          <div className="status">{status}</div>
        </div>
        <div className="call-actions">
          <button className="end-call-button">
            <MdCallEnd></MdCallEnd>
          </button>
          <button className="whiteboard-button">Show Whiteboard</button>
        </div>
      </div>
    </div>
  );
};

export default CallUI;