
export default function IncomingMessage ({message, image}){
    return (
        <div className="incoming-message">
            <div className="info">

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