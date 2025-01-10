
export default function IncomingMessage ({message, image}){
    return (
        <div className="incoming-message">
            <div className="info">
                <div className="name">
                    <span>Rahim Hasan</span>
                </div>
                {
                    image?<div className="photo">
                        <img className="sent-image" src={img} alt=""></img>
                    </div>
                : ''
                }
                
                <div className="message">
                    <span>{message}</span>
                </div>
            </div>
        </div>
    )
}