import { useEffect, useState } from "react";
import "./Countdown.css"; // we'll style separately

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getNextMonthFirstDay() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
  }

  function getTimeRemaining() {
    const now = new Date();
    const targetDate = getNextMonthFirstDay();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isFinished: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isFinished) {
    return (
      <div className="countdown-container">
        <h2 className="launch-text">🎉 We Are Live Now!</h2>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <h2 className="launch-text">🚀 Our App is Launching Soon!</h2>
      <div className="countdown-timer">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

const TimeBox = ({ value, label }) => (
  <div className="time-box">
    <span className="time-value">{String(value).padStart(2, "0")}</span>
    <p className="time-label">{label}</p>
  </div>
);

export default Countdown;
