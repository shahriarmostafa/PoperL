import { FaCalendar, FaChalkboardTeacher, FaChartLine, FaClock, FaGraduationCap } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Dashboard (){

    const axiosSecure = useAxiosSecure()
    const [stats, setStats] = useState({
        totalTeachers: 0,
        totalStudents: 0,
        totalMoney: 0,
        totalAvailableCreditWorth: 0,
        totalWithdrawals: 0,
        moneyInPlatform: 0,
        totalTeacherPoints: 0,
        thisMonthRevenue: 0,
        lastMonthRevenue: 0,
        revenueChange: 0,
        thisMonthEnrollments: 0,
        lastMonthEnrollments: 0,
        enrollmentChange: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pointValueLoading, setPointValueLoading] = useState(false);
    const [generatingHistory, setGeneratingHistory] = useState(false);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const response = await axiosSecure.get('/dashboard-stats');
                if (response.data.success) {
                    const { totalTeachers, totalStudents, platformMoneySummary } = response.data.data;
                    setStats({
                        totalTeachers,
                        totalStudents,
                        totalMoney: platformMoneySummary?.totalMoney || 0,
                        totalAvailableCreditWorth: platformMoneySummary?.totalAvailableCreditWorth || 0,
                        totalWithdrawals: platformMoneySummary?.totalWithdrawals || 0,
                        moneyInPlatform: platformMoneySummary?.moneyInPlatform || 0,
                        totalTeacherPoints: platformMoneySummary?.totalTeacherPoints || 0,
                        thisMonthRevenue: platformMoneySummary?.thisMonthRevenue || 0,
                        lastMonthRevenue: platformMoneySummary?.lastMonthRevenue || 0,
                        revenueChange: platformMoneySummary?.revenueChange || 0,
                        thisMonthEnrollments: platformMoneySummary?.thisMonthEnrollments || 0,
                        lastMonthEnrollments: platformMoneySummary?.lastMonthEnrollments || 0,
                        enrollmentChange: platformMoneySummary?.enrollmentChange || 0
                    });
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [axiosSecure]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleShowPointValue = async () => {
        try {
            setPointValueLoading(true);
            const response = await axiosSecure.get('/point-value');
            if (response.data?.pointValue) {
                Swal.fire({
                    title: 'Point Value',
                    text: `Current point value: $${response.data.pointValue.toFixed(2)}`,
                    icon: 'info',
                    confirmButtonColor: '#4E73DF',
                    confirmButtonText: 'Close'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Could not fetch point value',
                    icon: 'error',
                    confirmButtonColor: '#4E73DF'
                });
            }
        } catch (err) {
            console.error("Error fetching point value:", err);
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.error || 'Failed to fetch point value',
                icon: 'error',
                confirmButtonColor: '#4E73DF'
            });
        } finally {
            setPointValueLoading(false);
        }
    };

    const handleGenerateMonthlyHistory = async () => {
        try {
            setGeneratingHistory(true);
            const response = await axiosSecure.post('/generate-monthly-history');
            if (response.data.success) {
                Swal.fire({
                    title: 'Success',
                    text: 'Monthly history generated successfully',
                    icon: 'success',
                    confirmButtonColor: '#4E73DF',
                    confirmButtonText: 'Close'
                });
                // Refresh dashboard data
                const statsResponse = await axiosSecure.get('/dashboard-stats');
                if (statsResponse.data.success) {
                    const { totalTeachers, totalStudents, platformMoneySummary } = statsResponse.data.data;
                    setStats({
                        totalTeachers,
                        totalStudents,
                        totalMoney: platformMoneySummary?.totalMoney || 0,
                        totalAvailableCreditWorth: platformMoneySummary?.totalAvailableCreditWorth || 0,
                        totalWithdrawals: platformMoneySummary?.totalWithdrawals || 0,
                        moneyInPlatform: platformMoneySummary?.moneyInPlatform || 0,
                        totalTeacherPoints: platformMoneySummary?.totalTeacherPoints || 0,
                        thisMonthRevenue: platformMoneySummary?.thisMonthRevenue || 0,
                        lastMonthRevenue: platformMoneySummary?.lastMonthRevenue || 0,
                        revenueChange: platformMoneySummary?.revenueChange || 0,
                        thisMonthEnrollments: platformMoneySummary?.thisMonthEnrollments || 0,
                        lastMonthEnrollments: platformMoneySummary?.lastMonthEnrollments || 0,
                        enrollmentChange: platformMoneySummary?.enrollmentChange || 0
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to generate monthly history',
                    icon: 'error',
                    confirmButtonColor: '#4E73DF'
                });
            }
        } catch (err) {
            console.error("Error generating monthly history:", err);
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.error || 'Failed to generate monthly history',
                icon: 'error',
                confirmButtonColor: '#4E73DF'
            });
        } finally {
            setGeneratingHistory(false);
        }
    };

    return(
        <div className="analytics">
            <div className="container">
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleShowPointValue}
                        disabled={pointValueLoading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4E73DF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: pointValueLoading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        {pointValueLoading ? 'Loading...' : 'View Point Value'}
                    </button>
                    <button 
                        onClick={handleGenerateMonthlyHistory}
                        disabled={generatingHistory}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: generatingHistory ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        {generatingHistory ? 'Generating...' : 'Generate Monthly History'}
                    </button>
                </div>
                <div className="st-and-te">
                    <div className="total-teachers box d-flex">
                        <div className="icon">
                            <FaChalkboardTeacher></FaChalkboardTeacher>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Teachers</h4>
                            </div>
                            <div className="number">{loading ? '...' : stats.totalTeachers}</div>
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
                            <div className="number">{loading ? '...' : stats.totalStudents}</div>
                        </div>
                    </div>
                    <div className="Revenue box d-flex">
                        <div className="icon">
                            <FaBangladeshiTakaSign></FaBangladeshiTakaSign>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Total Revenue</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.totalMoney)}</div>
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
                                <h4>This Month Revenue</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.thisMonthRevenue)}</div>
                        </div>
                    </div>
                    <div className="last-month box d-flex">
                        <div className="icon">
                            <FaClock></FaClock>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Last Month Revenue</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.lastMonthRevenue)}</div>
                        </div>
                    </div>
                    <div className="difference box d-flex">
                        <div className="icon">
                            <FaChartLine></FaChartLine>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Revenue Difference</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.revenueChange)}</div>
                        </div>
                    </div>
                </div>
                <div className="st-and-te">
                    <div className="this-month box d-flex">
                        <div className="icon">
                            <FaGraduationCap></FaGraduationCap>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>This Month Enrollments</h4>
                            </div>
                            <div className="number">{loading ? '...' : stats.thisMonthEnrollments}</div>
                        </div>
                    </div>
                    <div className="last-month box d-flex">
                        <div className="icon">
                            <FaGraduationCap></FaGraduationCap>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Last Month Enrollments</h4>
                            </div>
                            <div className="number">{loading ? '...' : stats.lastMonthEnrollments}</div>
                        </div>
                    </div>
                    <div className="difference box d-flex">
                        <div className="icon">
                            <FaChartLine></FaChartLine>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Enrollment Difference</h4>
                            </div>
                            <div className="number">{loading ? '...' : stats.enrollmentChange}</div>
                        </div>
                    </div>
                </div>
                <div className="st-and-te">
                    <div className="money-in-platform box d-flex">
                        <div className="icon">
                            <FaChartLine></FaChartLine>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Money In Platform</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.moneyInPlatform)}</div>
                        </div>
                    </div>
                    <div className="available-credit box d-flex">
                        <div className="icon">
                            <FaCalendar></FaCalendar>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Available Credit Worth</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.totalAvailableCreditWorth)}</div>
                        </div>
                    </div>
                    <div className="withdrawals box d-flex">
                        <div className="icon">
                            <FaClock></FaClock>
                        </div>
                        <div className="subject">
                            <div className="text">
                                <h4>Total Withdrawals</h4>
                            </div>
                            <div className="number">{loading ? '...' : formatCurrency(stats.totalWithdrawals)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}