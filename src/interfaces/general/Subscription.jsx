import { useContext, useEffect, useState } from 'react';
import '../../styles/after-login/general.css';
import Package from './Package/Package';
import { AuthContext } from '../../providers/AuthProvider';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.init';
import useSubscription from '../../Hooks/checkSubscription';

  
  





export default function Subscription() {

  const {user} = useContext(AuthContext);

  const { subscription, isSubscribed, subLoading } = useSubscription(user?.uid);

    //count down
    const [timeRemaining, setTimeRemaining] = useState(0);


  const packages = [
    {
      packageId: "houry_30",
      name: "Hourly",
      price: 30,
      durationDays: 1/24,
      dailyMinutesLimit: 30
    },
    {
      packageId: "three_hour_80",
      name: "Three Hours",
      price: 80,
      durationDays: 1/8,
      dailyMinutesLimit: 60
    },
    {
      packageId: "daily_110",
      name: "1 Day",
      price: 110,
      durationDays: 1,
      dailyMinutesLimit: 60
    },
    {
      packageId: "weekly_500",
      name: "Weekly",
      price: 500,
      durationDays: 7,
      dailyMinutesLimit: 60
    },
    {
      packageId: "monthly_1500",
      name: "30 Days",
      price: 1500,
      durationDays: 30,
      dailyMinutesLimit: 60
    }
  ];

  const startSubscription = async (durationDays , packageID, callLimit) => {
    try{
      const userRef = doc(db, "studentCollection", user.uid);
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setHours(currentDate.getHours() + durationDays * 24);

      await updateDoc(userRef, {
        subscription: {
          packageID,
          startDate: currentDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          callLimit: callLimit,
          isActive: true,
          paymentStatus: "approved",
          purchasedAt: serverTimestamp()
        }
      })
      window.location.reload(false)
      return true;

    }catch(err) {
      console.log(err);
      return false;
    }
  }

  useEffect(() => {

    if(timeRemaining <= 0) return

    const liveValidation = setTimeout(() => {
      setTimeRemaining(prev => prev - 1000);
    }, 1000)
  
    return () => clearTimeout(liveValidation)

  }, [timeRemaining])



  function getTimeDifference(diffInMs) {
    
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % 60000) / 1000);

    return {days, hours, minutes, seconds}
  }

  useEffect(() => {
    const start = new Date();
    const expiry = new Date(subscription?.expiryDate);
    const diffInMs = expiry - start; // Difference in milliseconds
    setTimeRemaining(diffInMs)
    
  }, [subscription])

  const {days, hours, minutes, seconds} = getTimeDifference(timeRemaining)


  


  if(subLoading || !isSubscribed || !subscription){
    return (
            <section className="subscription night-view">
              <div className="container py-5">
                  <div className="title text-center">
                      <h2>Get Started</h2>
                  </div>
                  <div className="packages d-flex flex-wrap">
                      
                      {packages.map(pack => {
                          return <Package packageID={pack.packageId} name={pack.name} duration={pack.durationDays} callLimit={pack.dailyMinutesLimit} price={pack.price} key={pack.packageId} activateFunction={startSubscription}></Package>
                      })}
                  </div>
              </div>
            </section>
          )
  }



    return(
      <section className="subscription night-view">
          <div className="container">
            <div className="inner-details">
            <div className="package-card">
      
      {/* Package Name */}
      <div className="section package-info">
        <h2 className="title">Package</h2>
        <p className="value">{subscription.packageName || "Weekly Package"}</p>
      </div>

      {/* Time Remaining */}
      <div className="section time-remaining">
        <h2 className="title">Time Remaining</h2>
        <p className="value">{days > 0 && `${days} Days,`} {`${hours}:${minutes}:${seconds}`}</p>
      </div>

      {/* Call Remaining */}
      <div className="section call-info">
        <h2 className="title">Call Remaining</h2>
        <p className="value">{parseInt(subscription.callLimit)} Minutes, {Math.round((subscription.callLimit % 1) * 60)} seconds</p>
      </div>
      
    </div>
            </div>
          </div>
      </section>

    
    
    )
}