import {Link, useLoaderData} from 'react-router-dom';
import Pack from './Pack';
import '../admin.css';
import usePackages from "../../../Hooks/usePackages"
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

export default function Packages(){

    const [isLoading, packageData, refetch] = usePackages();

    const axiosSecure = useAxiosSecure()

    const deleteFun = (id) => {
        Swal.fire({
            title: "Delte!",
            text: "Are you sure you want to delete?",
            showCancelButton: true,
            showConfirmButton: true
        }).then (async (result) => {
            if(result.isConfirmed){
                await axiosSecure.delete(`/pack/${id}`)
                refetch()
            }
        })
    }

    
    return (
        <div className="analytics">
            <div className="redi-buttons mb-4 d-flex">
                <Link to="/maintainance/add-package">
                    <button className="show-all">Add New Package</button>
                </Link>
            </div>
            <div className="packages">
                {packageData.map(x => {
                    return <Pack 
                    id={x._id} 
                    callDuration={x.dailyMinutesLimit} 
                    key={x._id} 
                    packName={x.name} 
                    price={x.price} 
                    packageLimit={x.durationDays}
                    deleteFun={deleteFun}>
                    </Pack>
                })}
            </div>
        </div>
    )
}