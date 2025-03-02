import { FaHeart, FaThumbsDown } from "react-icons/fa";
import {setTeacherFeedback} from "../../../Hooks/setTeacherFeedBack";

export default function IncomingMessage ({message, image, audio, isFirstInGroup, isLastInGroup, viewImage, senderId, showFeedback, chatId, index}){
    
    const handleLike = () => setTeacherFeedback(senderId, true, chatId, index);
    const handleDislike = () => setTeacherFeedback(senderId, false, chatId, index);
    
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
                {showFeedback && (
                    <div className="feedback">
                        <button className="dislike" onClick={handleDislike}><FaThumbsDown></FaThumbsDown></button>
                        <button className="love" onClick={handleLike}><FaHeart></FaHeart></button>
                    </div>
                )}
            </div>
        </div>
    )
}