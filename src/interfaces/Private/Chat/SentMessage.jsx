import img from '../../../assests/328039808_553574763481911_1410511776054264885_n.jpg';

export default function SentMessage() {
    return (
        <div className="my-message">
            <div className="info">
                <div className="photo">
                    <img className="sent-image" src={img} alt=""></img>
                </div>
                <div className="message">
                    <span>What is a+b, what about you? Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, debitis!</span>
                </div>
                
            </div>
        </div>
    )
}