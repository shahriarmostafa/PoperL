import useSalaryData from "../../../Hooks/useSalaryData";
import SalaryItem from "./SalaryItem";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function Salary() {
    const [isLoading, salaryData, refetch] = useSalaryData();
    const axiosSecure = useAxiosSecure();

    const pendingCount = salaryData.filter((s) => !s.paid).length;
    const totalPaid = salaryData
        .filter((s) => s.paid)
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);
    const totalPending = salaryData
        .filter((s) => !s.paid)
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);

    const payHandler = (id) => {
        Swal.fire({
            title: "Mark as Paid?",
            text: "This will mark the withdrawal request as paid.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#059669",
            confirmButtonText: "Yes, Mark Paid",
        }).then(async (res) => {
            if (res.isConfirmed) {
                await axiosSecure.patch(`/paySalary/${id}`);
                refetch();
                Swal.fire({ title: "Marked as paid", icon: "success", timer: 1400, showConfirmButton: false });
            }
        });
    };

    return (
        <div className="analytics">
            <div className="salary-stats-row">
                <div className="salary-stat pending">
                    <span>Pending</span>
                    <b>{pendingCount} requests</b>
                    <small>৳{totalPending.toFixed(2)}</small>
                </div>
                <div className="salary-stat paid">
                    <span>Paid out</span>
                    <b>{salaryData.filter((s) => s.paid).length} requests</b>
                    <small>৳{totalPaid.toFixed(2)}</small>
                </div>
                <div className="salary-stat total">
                    <span>Total requests</span>
                    <b>{salaryData.length}</b>
                </div>
            </div>

            <div className="table salary-table">
                {isLoading ? (
                    <div className="text-center p-4">Loading…</div>
                ) : salaryData.length === 0 ? (
                    <div className="text-center p-4">No withdrawal requests yet</div>
                ) : (
                    <table>
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>Teacher</th>
                                <th>bKash Number</th>
                                <th>Points</th>
                                <th>Amount</th>
                                <th>Requested</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            {salaryData.map((item, index) => (
                                <SalaryItem
                                    key={item._id}
                                    id={item._id}
                                    serial={index + 1}
                                    name={item.name}
                                    uid={item.uid}
                                    bkashNumber={item.bkashNumber}
                                    points={item.points}
                                    amount={item.amount}
                                    requestedAt={item.requestedAt}
                                    paid={item.paid}
                                    paidAt={item.paidAt}
                                    payFunction={payHandler}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
