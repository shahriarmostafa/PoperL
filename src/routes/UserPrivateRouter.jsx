import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

export default function UserPrivateRouter({children}) {
    const {user, userProfileLoading} = useContext(AuthContext);
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
    return <Navigate to="/signin"></Navigate>
}