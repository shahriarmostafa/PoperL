import { Link } from "react-router-dom";
import avatar from '../../../assests/avatar.avif';
export default function ChatTop({profileImg, userName}){
    const usedName = userName? (userName.split(/\s+/).slice(0, 2).join(' ')): userName;
    return (

        <div className="topper">
                    <div className="container justify-content-between d-flex">
                        <div className="left d-flex">
                            <div className="back-btn">
                                <Link to="/chat">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                                </Link>
                            </div>
                            <div className="user-profile mx-1">
                                <img src={profileImg || avatar} alt="" />
                            </div>
                            <div className="userName"><b>{usedName}</b></div>
                        </div>
                        <div className="right d-flex align-items-center">
                            <div className="call-audio d-flex">
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                                </button>
                            </div>
                            <div className="call-video d-flex">
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
    )
}