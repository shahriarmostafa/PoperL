import { FaHome, FaAngry, FaEdit, FaHistory, FaMoneyBill, FaUserCheck, FaUserPlus, FaBook, FaClipboardList, FaBoxOpen, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { NavLink } from "react-router-dom";
// import './sidebar.css';
export default function Bar(){
    return(
        <div className="sidebar">
                <div className="display-names">
                    <NavLink to="/maintainance/dashboard">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaHome />                            
                            </div>
                            <p>Dashboard</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/teachers">
                        <div className="item container  d-flex">
                            <div className="icon">
                            <FaUserCheck />
                            </div>
                            <p>Teachers</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/history">
                        <div className="item container  d-flex">
                            <div className="icon">
                            <FaHistory />
                            </div>
                            <p>History</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/packages">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaEdit />
                            </div>
                            <p>Manage Packages</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/complains">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaAngry />
                            </div>
                            <p>Complains</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/salary">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaMoneyBill></FaMoneyBill>
                            </div>
                            <p>Salary</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/add-user-package">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaUserPlus />
                            </div>
                            <p>Add User Package</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/subjects">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaBook />
                            </div>
                            <p>Manage Subjects</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/active-packages">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaBoxOpen />
                            </div>
                            <p>Active Packages</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/public-quizzes">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaClipboardList />
                            </div>
                            <p>Public Quizzes</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/study-rooms">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaUsers />
                            </div>
                            <p>Study Rooms</p>
                        </div>
                    </NavLink>
                    <NavLink to="/maintainance/courses">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaChalkboardTeacher />
                            </div>
                            <p>Courses</p>
                        </div>
                    </NavLink>
                    {/* <NavLink to="/">
                        <div className="item container d-flex">
                            <div className="icon">
                                <SlSettings  />
                            </div>
                            <p>Settings</p>
                        </div>
                    </NavLink> */}
                </div>
            </div>
    );
}
