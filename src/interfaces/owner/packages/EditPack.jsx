import Sidebar from '../shared/Sidebar/Bar';
import Nav from '../shared/navbar/Nav';
import '../admin.css';
import { useLoaderData, useNavigate } from 'react-router-dom';
export default function EditPack(){
    const specificPack = useLoaderData();
    const navigate = useNavigate();
    const handleEdit = (e) => {
        e.preventDefault();
        const pName = e.target.packageName.value;
        const pPrice = e.target.price.value;
        const details = {pName, pPrice};        
        fetch(`http://localhost:5000/pack/${specificPack._id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(details)
        }).then(data => data.json()).then(res => {
            if(res.modifiedCount == 1){
                navigate('/packages')
            }
            
        })
                
    }

    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Sidebar></Sidebar>
                <div className="view">
                    <Nav></Nav>
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
                </div>
            </div>
        </section>

    )
}