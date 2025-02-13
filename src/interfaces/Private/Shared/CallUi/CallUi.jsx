import { useState, useEffect } from 'react';
import { MdCallEnd } from 'react-icons/md';


const CallUi = ({ callerName  }) => {

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
        <div className="call-header">In Call With</div>
        <div className="caller-name">{callerName}</div>
        <div className="call-duration">Duration: {formatTime(seconds)}</div>
        <div className="call-actions">
          <button className="end-call-button">
            <MdCallEnd></MdCallEnd>
          </button>
          <button className="whiteboard-button">
            Show Whiteboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallUi;


