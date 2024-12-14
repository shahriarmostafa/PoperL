import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

export default function Home(){
    const handleLogOut = () => {
        logOut().then(success => {
            console.log(success);
            
        }).catch(err => {
            console.log(err);
        })
    }
    const {user, logOut} = useContext(AuthContext);
    return (
        <div className="home">
            <div className="user">
                {user?.displayName}
            </div>
            <button onClick={handleLogOut}>Sign Out</button>
        </div>
    );
}