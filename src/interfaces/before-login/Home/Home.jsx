import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import "./home.css";
import logo from "/logo-text.png";
import { FaChalkboardTeacher, FaCalendarAlt, FaComments } from 'react-icons/fa'; // React Icons for features
import sliderImg1 from "../../../assests/slider-image-1.jpg";
import sliderImg2 from "../../../assests/slider-image-2.jpg";
import sliderImg3 from "../../../assests/slider-image-3.jpg";
 

import Pack from './Pack';
import Swal from 'sweetalert2';
import Countdown from './Countdown';

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

  const navigate = useNavigate()


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

  



  const packages = [
    {
      packageId: "houry_30",
      name: "Hourly",
      price: 50,
      durationDays: 1 / 24,
      dailyMinutesLimit: 30,
    },
    {
      packageId: "three_hour_80",
      name: "Three Hours",
      price: 90,
      durationDays: 1 / 8,
      dailyMinutesLimit: 60,
    },
    {
      packageId: "daily_110",
      name: "1 Day",
      price: 120,
      durationDays: 1,
      dailyMinutesLimit: 60,
    },
    {
      packageId: "weekly_500",
      name: "Weekly",
      price: 550,
      durationDays: 7,
      dailyMinutesLimit: 60,
    },
    {
      packageId: "monthly_1500",
      name: "30 Days",
      price: 1800,
      durationDays: 30,
      dailyMinutesLimit: 60,
    },
  ];
  




    

    




        if(window.ReactNativeWebView){
          return(
            <div className="education-page-home vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white p-4 position-relative overflow-hidden">
              {/* Header with Logo and Menu Icon */}
              <div className="header position-absolute top-0 start-0 end-0 d-flex justify-content-between align-items-center p-3">
                <img src="/512.png" alt="PoperL Logo" className="nav-logo" style={{ width: "40px" }} />
                <div className="menu-icon fs-4 cursor-pointer" style={{ transition: "0.3s" }}>☰</div>
              </div>
              {/* Background with Gradient Animation */}
              <div className="background position-absolute top-0 start-0 w-100 h-100"></div>
              {/* Floating Shapes */}
              <div className="shape shape1 position-absolute rounded-circle" style={{ width: "120px", height: "120px", background: "rgba(255, 255, 255, 0.2)", filter: "blur(40px)", top: "10%", left: "5%" }}></div>
              <div className="shape shape2 position-absolute rounded-circle" style={{ width: "120px", height: "120px", background: "rgba(255, 255, 255, 0.2)", filter: "blur(40px)", bottom: "15%", right: "10%" }}></div>
              {/* Hero Image with Parallax Effect */}
              <img src="/logo-text.png" alt="Learning" className="hero-img mb-4" style={{ width: "75%", maxWidth: "280px", animation: "float 3s ease-in-out infinite" }} />
              {/* Glassmorphism Message Box */}
              <div className="message-box bg-white bg-opacity-10 p-4 rounded-4 backdrop-filter blur-10 shadow w-90 max-w-350 text-center mb-4">
                <h2 className="fs-1 fw-bold">Unlock Your Potential with <span className="highlight" style={{ color: "#ffcc00" }}>PoperL</span></h2>
                <p className="fs-5 opacity-90 mt-2">Gain expert knowledge anytime, anywhere.</p>
              </div>
              {/* Call to Action Button with Animation */}
              <button className="cta-btn btn btn-warning fw-bold fs-5 px-4 py-2 rounded-pill shadow-lg" onClick={() => navigate("/signin")}>
                Start Learning →
              </button>
            </div>
          );
        }
        
        else{
          return(
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
                  <Link to='/teacherSignUp'><button className="btn btn-light">Apply as a teacher</button></Link>
                </div>
              </header>

              {/* Hero Section */}
              <section className="text-center mt-5 position-relative z-index-1 hero-section">
                <Countdown />
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

