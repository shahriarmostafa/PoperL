import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export default function UserPublicRouter({children}) {
    const {user, userProfileLoading} = useContext(AuthContext);
    const location = useLocation();
    if(user){
        return <Navigate state={location.pathname} to="/user"></Navigate>;
    }
    else{
        return children
    }
}