export default function Pack({name, duration, credit, price}){
    return (
        <div className="pack-home">
            <div className="name">
                <h4>{name}</h4>
            </div>
            <div className="details">
                <ul>
                    <li>Duration: {duration <= 24? duration + " Hour" : duration /24 +" Days"}</li>
                    <li>Credit: {credit} unit</li>
                    <li>Price:  
                        <span> {price}  <span className="taka-sign"> &#2547;</span> </span>
                        {price > 200 && <span className="success">(SAVE  {110 * duration/24 - price}<span className="taka-sign">&#2547;</span>)</span> } 
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