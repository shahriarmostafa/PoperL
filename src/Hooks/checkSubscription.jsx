import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.init";

const useSubscription = (userId) => {
    const [subscription, setSubscription] = useState(null);
    const [subLoading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [userRole, setUserRole] = useState(null); // "student" or "teacher"

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            // Check if user is in studentCollection
            const studentRef = doc(db, "studentCollection", userId);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                setUserRole("student");
                const { subscription } = studentSnap.data();
                if (subscription?.isActive) {
                    const isValid = new Date(subscription.expiryDate) > new Date();
                    setIsSubscribed(isValid);
                    setSubscription(subscription);
                }
            } else {
                // Check if user is in teacherCollection
                const teacherRef = doc(db, "teacherCollection", userId);
                const teacherSnap = await getDoc(teacherRef);

                if (teacherSnap.exists()) {
                    setUserRole("teacher");
                }
            }

            setLoading(false);
        };

        fetchUserData();
    }, [userId]);

    return { subscription, isSubscribed, subLoading, userRole };
};

export default useSubscription;
