import img from '../../../assests/328039808_553574763481911_1410511776054264885_n.jpg';

export default function SentMessage({message, image}) {
    return (
        <div className="my-message">
            <div className="info">
                <div className="photo">
                    {
                        image? <img className="sent-image" src={image} alt=""></img>: ''
                    }
                </div>
                <div className="message">
                    <span>{message}</span>
                </div>
                
            </div>
        </div>
    )
}