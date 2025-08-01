import {Link} from "react-router-dom";

export default function Pack({packName, packageLimit, price, credit, id, deleteFun, category, type}){

    

    return (
            <div className="package">
                <h3 className="headline">{packName}</h3>

                <ul>
                    <li>Category: {category}</li>
                    <li>Category: {type}</li>
                    <li>Package validity: {packageLimit}</li>
                    <li>Price: {price}</li>
                    <li>Credit: {credit}</li>
                </ul>
                <div className="redi-buttons">
                    <Link to={`/maintainance/pack/${id}/${packName}/${price}/${packageLimit}/${credit}`}>
                        <button className="">Edit Package</button>
                    </Link>
                </div>
                <div className="redi-buttons mt-1">
                    <button onClick={() => deleteFun(id)}>Delete Package</button>
                </div>
            </div>
    );
}