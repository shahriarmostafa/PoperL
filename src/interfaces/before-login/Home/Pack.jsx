import { FaCheckCircle, FaStar, FaArrowRight, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PACK_FEATURES = {
  houry:   ["More than 20 minutes of live session", "Audio session + whiteboard", "Any subject", "24H chat support"],
  daily:   ["More than 40 minutes of live session", "Audio session + whiteboard", "Any subject", "Session recordings(not available for now)", "Chat support"],
  weekly:  ["More than 200 minutes of live session", "Audio session + whiteboard", "Multi-subject", "Session recordings (not available for now)", "Priority matching", "Progress reports"],
  monthly: ["More than 800 minutes of live session", "Audio session + whiteboard", "All subjects", "Session recordings (not available for now)", "Priority matching", "Monthly progress report", "Parent dashboard"],
};

const POPULAR = "weekly";

export default function Pack({ packageId, name, price, durationDays, credit }) {
  const navigate = useNavigate();
  const isPopular = packageId === POPULAR;
  const features = PACK_FEATURES[packageId] ?? [];

  return (
    <div className={`pack-home${isPopular ? ' featured' : ''}`}
         style={isPopular ? { border: '2px solid #5468FF', boxShadow: '0 0 0 1px rgba(84,104,255,0.2)' } : {}}>
      {isPopular && <div className="pack-popular-ribbon">Most popular</div>}

      <div className="pack-card-top">
        <div className={`pack-badge${isPopular ? ' popular' : ''}`}>
          {isPopular ? '⭐ Most Popular' : packageId === 'monthly' ? '🔥 Best Value' : packageId === 'houry' ? '⚡ Quick Start' : '📅 ' + name}
        </div>
        <div className="name">
          <h4>{name}</h4>
          <p>{durationDays === 1 ? 'Single session' : durationDays < 48 ? 'Daily access' : durationDays < 200 ? 'Weekly plan' : 'Monthly plan'}</p>
        </div>
        <div className="pack-price">
          <span className="currency">৳</span>{price.toLocaleString()}<span className="period">/{durationDays === 1 ? 'hr' : durationDays < 48 ? 'day' : durationDays < 200 ? 'wk' : 'mo'}</span>
        </div>
        <div className="pack-credits-pill">
          <FaStar /> {credit.toLocaleString()} credits included
        </div>
      </div>

      <div className="pack-card-body">
        <ul className="pack-features">
          {features.map((f, i) => (
            <li key={i}><FaCheckCircle /> {f}</li>
          ))}
        </ul>
        <button
          className={`pack-cta${isPopular ? ' primary' : ''}`}
          onClick={() => navigate('/signin')}
        >
          Get Started <FaArrowRight style={{ fontSize: '0.75rem' }} />
        </button>
      </div>
    </div>
  );
}