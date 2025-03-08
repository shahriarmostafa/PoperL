import useSalaryData from "../../../Hooks/useSalaryData";
import SalaryItem from "./SalaryItem";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
export default function Salary(){

    const [isLoading,salaryData, refetch] = useSalaryData()
    const axiosSecure = useAxiosSecure();
    const payHandler = (id) => {
        Swal.fire({
            title: "Are you sure",
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if(res.isConfirmed === true){
                const result = await axiosSecure.patch(`/paySalary/${id}`);
                refetch()
            }
        })
    }

    return(
        <div className="analytics">
            <div className="table revenue-table">
                <table>
                    <tbody>
                        <tr>
                            <th>Serial No</th>
                            <th>Name</th>
                            <th>Teacher ID</th>
                            <th>Amount</th>
                            <th>Points</th>
                            <th>Action</th>
                        </tr>
                        {
                            salaryData &&
                            salaryData.map((item, index) => {
                                return <SalaryItem key={item.uid} name={item.name} uid={item.uid} serial={index + 1} paid={item.paid} points={item.points} earning={item.income} payFunction={payHandler}></SalaryItem>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>

    )
}