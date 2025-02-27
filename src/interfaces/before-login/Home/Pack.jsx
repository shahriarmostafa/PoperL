export default function Pack({name, duration, callLimit, price}){
    return (
        <div className="pack-home">
            <div className="name">
                <h4>{name}</h4>
            </div>
            <div className="details">
                <ul>
                    <li>Duration: {duration < 1? (duration * 24) + " Hours" : duration +" Days"}</li>
                    <li>Max Call Limit: {callLimit} minutes</li>
                    <li>Price:  
                        <span> {price}  <span className="taka-sign"> &#2547;</span> </span>
                        {price > 200 && <span className="success">(SAVE  {110 * duration - price}<span className="taka-sign">&#2547;</span>)</span> } 
                    </li>
                </ul>
            </div>
            <div className="coupon-link">
                <button>Enter a refer email for discount</button>
            </div>
            <div className="procceed">
                <button>START</button>
            </div>
        </div>
    )
}