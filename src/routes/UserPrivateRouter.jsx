import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export default function UserPrivateRouter({children}) {
    const {user, userProfileLoading} = useContext(AuthContext);
    const location = useLocation();
    if(userProfileLoading){
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }
    if(user){
        return children;
    }
    return <Navigate state={location.pathname} to="/signin"></Navigate>
}