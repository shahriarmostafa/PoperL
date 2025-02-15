import '../admin.css';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
export default function EditPack(){
    const specificPack = useLoaderData();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();



    const handleEdit = (e) => {
        e.preventDefault();
        const pName = e.target.packageName.value;
        const pPrice = e.target.price.value;
        const details = {pName, pPrice};        
        axiosSecure.put(`pack/${specificPack._id}`, details)
        .then(data => data.json()).then(res => {
            if(res.modifiedCount == 1){
                navigate('/packages')
            }
            
        })
                
    }

    return (
        <div className="analytics">
            <div className="form">
                <h3 className="headline">Edit {specificPack.packageName} Pack</h3>
                <form onSubmit={handleEdit}>
                    <input name="packageName" type="text" placeholder="Enter the new name"/>
                    <input name="price" type="number" placeholder="Enter the new price"/>
                    <input type="submit" className="show-all"/>
                </form>
            </div>
        </div>

    )
}