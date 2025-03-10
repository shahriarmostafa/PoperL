import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import "./home.css";
import logo from "/logo-text.png";
import { FaChalkboardTeacher, FaCalendarAlt, FaComments } from 'react-icons/fa'; // React Icons for features
import sliderImg1 from "../../../assests/slider-image-1.jpg";
import sliderImg2 from "../../../assests/slider-image-2.jpg";
import sliderImg3 from "../../../assests/slider-image-3.jpg";
 

import Pack from './Pack';
import Swal from 'sweetalert2';

export default function Home(){
  

    const [installPrompt, setInstallPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        setInstallPrompt(event);
        console.log('beforeinstallprompt event captured');
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  
  // check install option
  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt(); // Show the install prompt
      const choiceResult = await installPrompt.userChoice;      
      setInstallPrompt(null);
    }
  };


  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const sliderImages = document.querySelectorAll('.slider-image');
    const totalSlides = sliderImages.length;

    const interval = setInterval(() => {
      sliderImages[currentSlide].classList.remove('active');
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      sliderImages[(currentSlide + 1) % totalSlides].classList.add('active');
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    if(installPrompt){
      Swal.fire({
        title: "Install PoperL!",
        text: "Download now?",
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: "Install"
      }).then((result) => {
        if(result.isConfirmed){
          handleInstallClick()
        }
      })
    }
  }, [installPrompt])



  const packages = [
    {
      packageId: "houry_30",
      name: "Hourly",
      price: 30,
      durationDays: 1 / 24,
      dailyMinutesLimit: 30,
    },
    {
      packageId: "three_hour_80",
      name: "Three Hours",
      price: 80,
      durationDays: 1 / 8,
      dailyMinutesLimit: 60,
    },
    {
      packageId: "daily_110",
      name: "1 Day",
      price: 110,
      durationDays: 1,
      dailyMinutesLimit: 60,
    },
    {
      packageId: "weekly_500",
      name: "Weekly",
      price: 500,
      durationDays: 7,
      dailyMinutesLimit: 60,
    },
    {
      packageId: "monthly_1500",
      name: "30 Days",
      price: 1500,
      durationDays: 30,
      dailyMinutesLimit: 60,
    },
  ];
  




    

    



      if (window.matchMedia('(display-mode: standalone)').matches) {
        return <Navigate to="/signup"></Navigate>
      } else{
        return (
          <div className="min-vh-100 bg-dark text-white d-flex flex-column align-items-center">
      {/* Header and Hero Section with Slider Background */}
      <div className="header-hero-container position-relative w-100">
        {/* Slider Background */}
        <div className="slider-container position-absolute w-100 h-100">
          <div className="slider">
            <img src={sliderImg1} alt="Slide 1" className="slider-image active" />
            <img src={sliderImg2} alt="Slide 2" className="slider-image" />
            <img src={sliderImg3} alt="Slide 3" className="slider-image" />
          </div>
        </div>

        {/* Header */}
        <header className="w-100  py-3 px-4 shadow-sm position-relative z-index-1">
          <div className="container d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <button className="btn btn-light">Get Started</button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center mt-5 position-relative z-index-1 hero-section">
          <h2 className="display-4 text-light">Learn Anytime, Anywhere</h2>
          <p className="lead text-secondary">Connect with expert teachers on-demand.</p>
          {installPrompt ? (
            <button onClick={handleInstallClick} className="btn btn-danger btn-lg mt-3">
              Download
            </button>
          ) : (
            <button onClick={handleInstallClick} className="btn btn-danger btn-lg mt-3">
              Loading...
            </button>
          )}
        </section>
      </div>

      {/* Features */}
      <div className="container mt-5">
        <div className="row">
          {[
            { title: "Instant Tutoring", icon: <FaChalkboardTeacher size={40} /> },
            { title: "Flexible Packages", icon: <FaCalendarAlt size={40} /> },
            { title: "Interactive Whiteboard", icon: <FaComments size={40} /> },
          ].map((feature, index) => (
            <div key={index} className="col-md-4 text-center mb-4">
              <div className="feature-box p-4 bg-dark border border-danger rounded shadow-lg">
                <div className="icon text-danger mb-3">{feature.icon}</div>
                <h3 className="text-light">{feature.title}</h3>
                <p className="text-secondary">Seamless experience for students and teachers.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="packages-section bg-dark text-white py-5">
      <div className="container">
        <h2 className="text-center mb-4">Choose Your Package</h2>
        <div className="row">
          {packages.map((pkg) => (
            <div key={pkg.packageId} className="col-md-4 mb-4">
              <Pack
                name={pkg.name}
                duration={pkg.durationDays}
                callLimit={pkg.dailyMinutesLimit}
                price={pkg.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer className="mt-5 py-3 bg-danger text-center w-100">
        <p className="text-white">&copy; {new Date().getFullYear()} PoperL. All rights reserved.</p>
      </footer>
    </div>
        )
        
      }
}

