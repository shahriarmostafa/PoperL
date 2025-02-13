import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";


export const AuthContext = createContext(null);
export default function AuthProvider({children}){
    const [user, setUser] = useState({});
    const [userProfileLoading, setUserProfileLoading] = useState(true);
    


    const createUser = (email, password) => {
        setUserProfileLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const userSignIn = (email, password) => {
        setUserProfileLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const logOut = () => {
        setUserProfileLoading(true);
        return signOut(auth);
    }

    const editProfile = (user, updatedData) => {
        return updateProfile(user, updatedData)
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserProfileLoading(false);
            
        })
        return () => {
            unsubscribe();
        }
    },[]);
    

    const authUtility = {user, createUser, userSignIn, logOut, editProfile, userProfileLoading};
    return (
        <AuthContext.Provider value={authUtility}>
            {children}
        </AuthContext.Provider>
    );
}