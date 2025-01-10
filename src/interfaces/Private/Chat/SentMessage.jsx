
export default function SentMessage({message, image}) {
    return (
        <div className="my-message">
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