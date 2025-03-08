import { FaCalendar, FaChalkboardTeacher, FaChartLine, FaClock, FaGraduationCap } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function Dashboard (){

    const axiosSecure = useAxiosSecure()

    const closeMonthCalculation = () => {
        axiosSecure.post("/closeCalculation")
    }

    const resetMonthlyData = async () => {
        const result = await axiosSecure.post("/resetPoints");
        if(result.data.success == true){
            Swal.fire({
                title: "Success",
                text: result.data.message
            })
        }
        else{
            Swal.fire({
                title: "Failed!",
                text: result.data.message
            })
        }
    }

    return(
        <div className="analytics">
            <div className="container">
                <div className="st-and-te">
                    <div className="total-teachers box d-flex">
                        <div className="icon">
                            <FaChalkboardTeacher></FaChalkboardTeacher>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Teachers</h4>
                            </div>
                            <div className="number">531</div>
                        </div>
                    </div>
                    <div className="total-students box d-flex">
                        <div className="icon">
                            <FaGraduationCap></FaGraduationCap>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Students</h4>
                            </div>
                            <div className="number">22300</div>
                        </div>
                    </div>
                    <div className="Revenue box d-flex">
                        <div className="icon">
                            <FaBangladeshiTakaSign></FaBangladeshiTakaSign>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Revenue</h4>
                            </div>
                            <div className="number">$178689</div>
                        </div>
                    </div>
                </div>
                <div className="st-and-te">
                    <div className="this-month box d-flex">
                        <div className="icon">
                            <FaCalendar></FaCalendar>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>This Month</h4>
                            </div>
                            <div className="number">$1764</div>
                        </div>
                    </div>
                    <div className="last-month box d-flex">
                        <div className="icon">
                            <FaClock></FaClock>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Last Month</h4>
                            </div>
                            <div className="number">$2765</div>
                        </div>
                    </div>
                    <div className="difference box d-flex">
                        <div className="icon">
                            <FaChartLine></FaChartLine>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4> Difference</h4>
                            </div>
                            <div className="number">-$430</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="redi-buttons close-calculation-btn d-flex">
                    <button className="bg-danger" onClick={closeMonthCalculation}>Close the calculation of this month</button>
            </div>
            <div className="redi-buttons close-calculation-btn d-flex">
                    <button className="bg-danger" onClick={resetMonthlyData}>Reset Monthly Data</button>
            </div>
        </div>
    )
}