import { FaHome, FaUser, FaAngry, FaEdit, FaHistory } from "react-icons/fa";
import { NavLink } from "react-router-dom";
// import './sidebar.css';
export default function Nav(){
    return(
        <div className="sidebar">
                <div className="display-names">
                    <NavLink to="/">
                        <div className="item container  d-flex">
                            <div className="icon">
                                <FaHome />                            
                            </div>
                            <p>Dashboard</p>
                        </div>
                    </NavLink>
                    <NavLink to="/">
                        <div className="item container  d-flex">
                            <div className="icon">
                            <FaUser />
                            </div>
                            <p>Admins</p>
                        </div>
                    </NavLink>
                    <NavLink to="/">
                        <div className="item container  d-flex">
                            <div className="icon">
                            <FaHistory />
                            </div>
                            <p>History</p>
                        </div>
                    </NavLink>
                    <NavLink to="/">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaEdit />
                            </div>
                            <p>Manage Packages</p>
                        </div>
                    </NavLink>
                    <NavLink to="/">
                        <div className="item container d-flex">
                            <div className="icon">
                                <FaAngry />
                            </div>
                            <p>Complains</p>
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