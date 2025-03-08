export default function Package({name, packageID, duration, callLimit, price, activateFunction}){
    return (
        <div className="pack">
            <div className="name">
                <h4>{name}</h4>
            </div>
            <div className="details">
                <ul>
                    <li>Duration: {duration < 24? duration + " Hours" : (duration /24) + " Days"}</li>
                    <li>Call Limit: {callLimit} minutes</li>
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
                <button onClick={() => activateFunction(duration, packageID, callLimit, name, price)}>START</button>
            </div>
        </div>
    )
}