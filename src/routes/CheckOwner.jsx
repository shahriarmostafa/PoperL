import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "../Hooks/useAxiosSecure";

export default function CheckOwner ({children}){
    const {user, userProfileLoading} = useContext(AuthContext);
    const [isOwner, setIsOwner] = useState(false);

    const axiosSecure =  useAxiosSecure();
    useEffect( () => {
        const checkowner = async () => {
            console.log(user.uid);
            const result = await axiosSecure.get(`/isOwner/${user?.uid}`);
            setIsOwner(result.data.owner)
            
        }
        checkowner()        

    }, [user, isOwner]);

    if(userProfileLoading || !isOwner){
        return "Verifying..."
    }
    if(isOwner){
        return children;
    }
}