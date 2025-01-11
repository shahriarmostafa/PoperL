
export default function IncomingMessage ({message, image, isFirstInGroup, isLastInGroup}){
    return (
        <div className={`incoming-message ${isFirstInGroup ? "first-in-group" : ""} 
          ${isLastInGroup ? "last-in-group" : ""}`}>
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