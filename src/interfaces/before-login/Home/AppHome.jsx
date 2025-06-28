export default function AppHome(){
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
    )
}