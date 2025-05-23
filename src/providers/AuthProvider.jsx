import { createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile,
    GoogleAuthProvider } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth, { db } from "../firebase/firebase.init";
import { doc, getDoc, updateDoc } from "firebase/firestore";


export const AuthContext = createContext(null);
export default function AuthProvider({children}){
    const [user, setUser] = useState({});
    const [userProfileLoading, setUserProfileLoading] = useState(true);
    
    //provider sign up

    const googleProvider = new GoogleAuthProvider();


    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }



    const createUser = (email, password) => {
        setUserProfileLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const userSignIn = (email, password) => {
        setUserProfileLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const logOut = async() => {
        const teacherDocRef = doc(db, "teacherCollection", user.uid);
        const teacherSnap = await getDoc(teacherDocRef);
        if (teacherSnap.exists()) {
            await updateDoc(teacherDocRef, { isOnline: false });
        }
        setUserProfileLoading(true);
        return signOut(auth);
    }

    const editProfile = (user, updatedData) => {
        return updateProfile(user, updatedData)
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setUserProfileLoading(false);

            if (currentUser) {
                // Check if user is a teacher
                const teacherDocRef = doc(db, "teacherCollection", currentUser.uid);
                const teacherSnap = await getDoc(teacherDocRef);
          
                if (teacherSnap.exists()) {
                  // Only update online status if user is a teacher
                  await updateDoc(teacherDocRef, { isOnline: true });
          
                  // Set `isOnline: false` when they disconnect
                  window.addEventListener("beforeunload", async () => {
                    await updateDoc(teacherDocRef, { isOnline: false });
                  });
                  
                  
                // add this in logout later

                //   const handleLogout = async () => {
                //     if (user) {
                //       const teacherDocRef = doc(db, "teacherCollection", user.uid);
                //       await updateDoc(teacherDocRef, { isOnline: false });
                //     }
                //     await signOut(auth);
                //   };
                }
              }
            
        })
        return () => {
            unsubscribe();
        }
    },[]);
    

    const authUtility = {user, createUser, userSignIn, logOut, editProfile, signInWithGoogle, userProfileLoading};
    return (
        <AuthContext.Provider value={authUtility}>
            {children}
        </AuthContext.Provider>
    );
}