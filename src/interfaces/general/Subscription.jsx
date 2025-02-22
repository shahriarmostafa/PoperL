import '../../styles/after-login/general.css';
import Package from './Package/Package';


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
  
  





export default function Subscription() {
    return(
    <>
        <section className="subscription night-view">
            <div className="container py-5">
                <div className="title text-center">
                    <h2>Get Started</h2>
                </div>
                <div className="packages d-flex flex-wrap">
                    
                    {packages.map(pack => {
                        return <Package name={pack.name} duration={pack.durationDays} callLimit={pack.dailyMinutesLimit} price={pack.price} key={pack.packageId}></Package>
                    })}
                </div>
            </div>
        </section>
    </>
    )
}