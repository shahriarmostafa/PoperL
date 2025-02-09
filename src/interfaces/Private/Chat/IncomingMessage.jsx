
export default function IncomingMessage ({message, image, isFirstInGroup, isLastInGroup, viewImage}){
    return (
        <div className={`incoming-message ${isFirstInGroup ? "first-in-group" : ""} 
          ${isLastInGroup ? "last-in-group" : ""}`}>
            <div className="info">
                {
                    image?<div className="photo"  onClick={() => viewImage(image)}>
                        <img className="sent-image" src={img} alt=""></img>
                    </div>
                : ''
                }
                {
                    message? 
                    <div className="message">
                        <span>{message}</span>
                    </div>
                    : '' 
                }
            </div>
        </div>
    )
}