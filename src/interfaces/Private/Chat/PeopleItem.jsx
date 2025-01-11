import { Link } from 'react-router-dom';
import avatar from '../../../assests/avatar.avif';

export default function PeopleItem({img, name, lastMessage, clickFunc, isSeen}) {
    return (
            <div onClick={clickFunc} className={`${isSeen? "" : "active"} chat-item`}>
                <div className="img">
                    <img src={img || avatar} alt=""></img>
                </div>
                <div className="information">
                    <div className="name">
                        <h4>{name}</h4>
                    </div>
                    <div className="last-message">
                        <span>{lastMessage == ''? "No message Yet": lastMessage}</span>
                    </div>
                </div>
            </div>
    )
}