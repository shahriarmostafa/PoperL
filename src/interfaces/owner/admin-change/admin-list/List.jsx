import { useLoaderData } from "react-router-dom";
import ListItem from "./ListItem";
import { useState } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
export default function List(){
    const admins = useLoaderData();
    const [varAdmins, setVarAdmins] = useState(admins);

    const axiosSecure = useAxiosSecure();

    const handleDelete = (id) => {
       axiosSecure.delete(`/user/${id}`)
       .then(res => res.json())
       .then(data => {
            if(data.deletedCount == 1){
                // use refetech here
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
                {/* {varAdmins.map(x => {
                    return <ListItem key={x._id} name={x.userName} id={x._id} action={handleDelete}></ListItem>
                })} */}
            </tbody>
        </table>
            
    );
}