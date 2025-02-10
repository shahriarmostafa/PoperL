
export default function IncomingMessage ({message, image, audio, isFirstInGroup, isLastInGroup, viewImage}){
    return (
        <div className={`incoming-message ${isFirstInGroup ? "first-in-group" : ""} 
          ${isLastInGroup ? "last-in-group" : ""}`}>
            <div className="info">
                {
                    audio &&
                    <div className="audio">
                        <audio controls>
                            <source src={audio} type="audio/webm" />
                        </audio>
                    </div>
                }
                {
                    image?
                    <div className="photo"  onClick={() => viewImage(image)}>
                        <img className="sent-image" src={image} alt=""></img>
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