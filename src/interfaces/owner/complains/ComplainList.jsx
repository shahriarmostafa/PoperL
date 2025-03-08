import { useEffect } from "react";
import ComplainItem from "./ComplainItem";
import useAllComplains from "../../../Hooks/useAllComplaints";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function ComplainList (){

    
    const [isLoading, allComplains, refetch] = useAllComplains();

    const axiosSecure = useAxiosSecure();

    const deleteFun = (id) => {
        Swal.fire({
            text: "Are you Sure You want to Delete?",
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if(res.isConfirmed){
                await axiosSecure.delete(`/complain/${id}`);
                refetch();
            }
        })
    }


    return (
    <div className="analytics">
        <div className="table complain-table">
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>WhatsApp</th>
                        <th>Read</th>
                        <th>Delete</th>
                    </tr>
                    {
                        allComplains.map((item, index) => {
                            return <ComplainItem key={index} info={item} deleteFun={deleteFun}></ComplainItem>
                        })
                    }
                </tbody>
            </table>
            <div className="redi-buttons mt-4 d-flex">
                <a href="">
                    <button className="show-all">View All</button>
                </a>
        </div>
        </div>
    </div>
    )
}