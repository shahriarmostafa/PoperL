import {Link} from "react-router-dom";

export default function Pack({packName, packageLimit, price, deletePack, id}){

    

    return (
            <div className="package">
                <h3 className="headline">{packName}</h3>
                {/* <ul>
                    <li>Package validity: {packageLimit}</li>
                    <li>Max Calls: {callLimit}</li>
                    <li>Price: {price}</li>
                </ul> */}
                <ul>
                    <li>Package validity: {packageLimit}</li>
                    <li>Price: {price}</li>
                </ul>
                <div className="redi-buttons">
                    <Link to="/edit-package">
                        <button className="">Edit Package</button>
                    </Link>
                </div>
                <div className="redi-buttons mt-1">
                <button onClick={() => deletePack(id)}>Delete Package</button>
                </div>
            </div>
    );
}