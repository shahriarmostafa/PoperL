
export default function SentMessage({message, image, isFirstInGroup, isLastInGroup}) {
    return (
        <div className={`my-message ${isFirstInGroup ? "first-in-group" : ""} 
          ${isLastInGroup ? "last-in-group" : ""}`}>
            <div className="info">
                    {
                        image?
                        <div className="photo">
                            <img className="sent-image" src={image} alt=""></img>
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