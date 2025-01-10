import { Link } from 'react-router-dom';
import avatar from '../../../assests/avatar.avif';

export default function PeopleItem({chatID, img, name, lastMessage}) {
    return (
        <Link to={`/chat/${chatID}`}>
            <div className="active chat-item">
                <div className="img">
                    <img src={img || avatar} alt=""></img>
                </div>
                <div className="information">
                    <div className="name">
                        <h4>{name}</h4>
                    </div>
                    <div className="last-message">
                        <span>{lastMessage}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}