import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.init"; // Ensure auth is imported

const useSubscription = (userId) => {
    const [subscription, setSubscription] = useState(null);
    const [subLoading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
  
    useEffect(() => {
      const fetchSubscription = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }
  
        const userRef = doc(db, "studentCollection", userId);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const { subscription } = userSnap.data();
  
          if (subscription?.isActive) {
            const isValid = new Date(subscription.expiryDate) > new Date();
            setIsSubscribed(isValid);
            setSubscription(subscription);
          }
        }
  
        setLoading(false);
      };
  
      fetchSubscription();
    }, [userId]); // Runs effect when userId changes
  
    return { subscription, isSubscribed, subLoading };
  };
  

export default useSubscription;
