import img from '../../../assests/328039808_553574763481911_1410511776054264885_n.jpg';

export default function IncomingMessage (){
    return (
        <div className="incoming-message">
            <div className="info">
                <div className="name">
                    <span>Rahim Hasan</span>
                </div>
                <div className="photo">
                    <img className="sent-image" src={img} alt=""></img>
                </div>
                <div className="message">
                    <span>The answer is a2 + b2, this is what is about</span>
                </div>
            </div>
        </div>
    )
}