import { FaEye, FaTrash, FaUser, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";


export default function ComplainItem ({info, deleteFun}){

    const viewFun = () => {
        Swal.fire({
            title: info.title,
            text: info.description
        })
    }
    

    return (
        <tr>
            <td>
                <div className="icon mb-2">
                    <FaUser></FaUser>
                </div>
                {info.name}
            </td>
            <td>
                <div className="icon mb-2">
                    <FaWhatsapp></FaWhatsapp>
                </div>
                {info.whatsapp}
            </td>
            <td>
                <div className="redi-buttons">
                    <button onClick={viewFun} className="show-all bg-success">
                        <FaEye></FaEye>
                    </button>
                </div>
            </td>
            <td>
                <div className="redi-buttons">
                    <button onClick={() => deleteFun(info._id)} className="show-all bg-danger">
                        <FaTrash></FaTrash>
                    </button>
                </div>
            </td>
        </tr>
    )
}