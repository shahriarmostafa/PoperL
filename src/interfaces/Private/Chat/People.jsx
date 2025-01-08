import { Link } from 'react-router-dom';
import img from '../../../assests/328039808_553574763481911_1410511776054264885_n.jpg';


export default function People(){
    return (
        <div className="left-side">
            <div className="chat-list">
                <Link to="/chat/user">
                    <div className="active chat-item">
                        <div className="img">
                            <img src={img} alt=""></img>
                        </div>
                        <div className="information">
                            <div className="name">
                                <h4>Karim Hasan</h4>
                            </div>
                            <div className="last-message">
                                <span>The answer is a2 + b2  .2min</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}