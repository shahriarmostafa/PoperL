import {Link} from "react-router-dom";

export default function Pack({packName, packageLimit, price, callDuration, id, deleteFun}){

    

    return (
            <div className="package">
                <h3 className="headline">{packName}</h3>

                <ul>
                    <li>Package validity: {packageLimit}</li>
                    <li>Price: {price}</li>
                    <li>Call Duration: {callDuration}</li>
                </ul>
                <div className="redi-buttons">
                    <Link to={`/maintainance/pack/${id}/${packName}/${price}/${packageLimit}/${callDuration}`}>
                        <button className="">Edit Package</button>
                    </Link>
                </div>
                <div className="redi-buttons mt-1">
                    <button onClick={() => deleteFun(id)}>Delete Package</button>
                </div>
            </div>
    );
}