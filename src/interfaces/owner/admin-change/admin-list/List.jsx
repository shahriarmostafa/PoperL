import { useLoaderData } from "react-router-dom";
import ListItem from "./ListItem";
import { useState } from "react";
export default function List(){
    const admins = useLoaderData();
    const [varAdmins, setVarAdmins] = useState(admins);

    const handleDelete = (id) => {
       fetch(`http://localhost:5000/user/${id}`, {
        method: "DELETE"
        
       })
       .then(res => res.json())
       .then(data => {
        if(data.deletedCount == 1){
            const filteredData = admins.filter(data => data._id != id);
            setVarAdmins(filteredData)
        }
        
       })
    }
    return(
        <table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                {varAdmins.map(x => {
                    return <ListItem key={x._id} name={x.userName} id={x._id} action={handleDelete}></ListItem>
                })}
            </tbody>
        </table>
            
    );
}