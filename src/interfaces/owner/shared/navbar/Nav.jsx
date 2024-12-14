import profileIMG from '../../../../assests/328039808_553574763481911_1410511776054264885_n.jpg';
import logo from '../../../../assests/logo.svg';
export default function Nav() {
    return (
        <nav className="admin-nav owner-nav p-3">
            <div className="container d-flex">
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>

                <div className="profile">
                <img src={profileIMG} alt=""/>
                    <div className="dropdown">
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">List</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Account</a></li>
                            <li><a color="text-danger" href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}