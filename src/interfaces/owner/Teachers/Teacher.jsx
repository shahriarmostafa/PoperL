import { FaTrash } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export default function Teacher({id, name, level, joinedStampValue, photoURL, group, disableFun, deleteFun, icon, subjects, icon2}){

    const joined = new Date(joinedStampValue);

    return(
        <tr>
            <td>{name}</td>
            <td>{id}</td>
            <td>{joined? `${(joined).getFullYear()}.${(joined.getMonth() + 1).toString().padStart(2, '0')}.${joined.getDate().toString().padStart(2, '0')}` : "Not added"}</td>
            {
                !icon && <><td>{level}</td>
                <td>{group || "Not Joined"}</td></>
            }
            <td>
            {
                subjects? subjects.map(subject =><b key={subject}>{subject}</b>) : "Not Added"  
            }
            </td>
            
            <td>{photoURL || "Not added"}</td>
            <td>
                <div className="redi-buttons">
                    <button onClick={() => disableFun(id)} className={icon? "bg-success":`bg-secondar`}>{icon || <ImCross></ImCross>}</button>
                </div>
            </td>
            <td>
                <div className="redi-buttons">
                    <button onClick={() => deleteFun(id)} className={icon2? " bg-secondary" : 'bg-danger'}>{icon2 || <FaTrash></FaTrash>}</button>
                </div>
            </td>
        </tr>
    )
}