import logo from '../../../../assests/logo-white.svg';
import avatar from '../../../../assests/avatar.avif';
import { NavLink, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../providers/AuthProvider';
import useChatList from "../../../../Hooks/useChatList";
import { FaStickyNote, FaUser, FaUserGraduate } from 'react-icons/fa';
import { IoChatbox } from 'react-icons/io5';
import { RiFileSearchFill } from 'react-icons/ri';
import useSubscription from "../../../../Hooks/checkSubscription"

export default function Nav() {
    const {user, logOut} = useContext(AuthContext);
    const [showDropDown, setShowDropDown] = useState();

    const { userRole } = useSubscription(user?.uid);


    

    const signOut = () => {
        console.log("workin");
        
        logOut().then(res => {
            console.log(res);
            
        })
        .catch(err => {
            console.log(err);
        })
    }

    const {unseenCount} = useChatList();


        


    return(
        <nav>
            <div className="container d-flex">
                <Link to="/TeacherList">
                    <div className="logo">
                        <img src={logo} alt=""/>
                    </div>
                </Link>
                <div className="action-links d-flex">
                    <div className="pages pc-nav">
                        <ul className="">
                            <li><NavLink to="/user/chat">SUBJECTS</NavLink></li>
                            <li><NavLink to="/user">CONTENTS</NavLink></li>
                            <li><NavLink to="/user/TeacherList">Study</NavLink></li>
                            <li><NavLink to="/user/subscription">Subscription</NavLink></li>
                            <li><NavLink to="/user/chat">CHAT</NavLink></li>
                            <li><NavLink to="/user/complain">Complains</NavLink></li>
                        </ul>
                    </div>
                    <div className="pages shadow-fix mobile-nav">
                            <ul className="container">
                                {userRole === "student"? (
                                    <li>
                                        <NavLink to="/user/teachers">
                                            <FaUserGraduate></FaUserGraduate>
                                        </NavLink>
                                    </li>

                                ): (
                                    <li>
                                        <NavLink to="/user/profile">
                                            <FaUser></FaUser>
                                        </NavLink>
                                    </li>
                                    )
                                }
                                
                                <li className='number-of-unseen-chats'>
                                    {
                                        unseenCount?<div className="number-box">
                                                        <b className="number">
                                                            {unseenCount}
                                                        </b>
                                                    </div> : ""
                                    }
                                    
                                    <NavLink to="/user/chat">
                                        <IoChatbox></IoChatbox>
                                    </NavLink>
                                </li>
                                
                                {userRole === "student" && (
                                    <>
                                    <li>
                                    <NavLink to="/user/complain">
                                        <FaStickyNote></FaStickyNote>
                                    </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/user/subscription">
                                            <RiFileSearchFill />
                                        </NavLink>
                                    </li>
                                    </>
                                    
                                )}
                            </ul>
                    </div>
                    <div onClick={() => setShowDropDown(!showDropDown)} className="profile-pic">
                        <div className="inner">
                            <img src={user?.photoURL || avatar} alt=""/>
                        </div>
                    </div>
                    <div className={showDropDown? "dropdown d-flex" : "dropdown"}>
                            <ul>
                                <li>
                                    <Link to="/user/profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                                    <span>Profile</span>
                                    </Link>
                                </li>
                                <hr />
                                <li>
                                    <label className="switch">
                                        <input type="checkbox"/>
                                        <span className="slider"></span>
                                    </label>
                                    <span className="span">Night Mode</span>
                                </li>
                                <hr/>
                                <li>
                                    <button onClick={signOut}>
                                        LogOut
                                    </button>
                                </li>
                            </ul>
                        </div>

                </div>
                
            </div>
        </nav>
    )
}