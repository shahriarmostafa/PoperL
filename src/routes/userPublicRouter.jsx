import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export default function UserPublicRouter({children}) {
    const {user, userProfileLoading} = useContext(AuthContext);
    const location = useLocation();
    if(userProfileLoading){
        return "Loading..."
    }
    if(!user){
        return children;
    }
    else{
        return <Navigate state={location.pathname} to="/user/chat"></Navigate>
    }
}