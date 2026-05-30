import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaComments,
  FaMobileAlt,
  FaShieldAlt,
  FaVideo,
} from "react-icons/fa";
import "./home.css";
import logo from "/logo-blue.png";
import sliderImg1 from "../../../assests/slider-image-1.jpg";
import Pack from "./Pack";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const packages = [
  { packageId: "houry", name: "Basic Hour", price: 50, durationDays: 1, credit: 120 },
  { packageId: "daily", name: "Daily Focus", price: 120, durationDays: 24, credit: 250 },
  { packageId: "weekly", name: "Weekly Scholar's", price: 550, durationDays: 168, credit: 1200 },
  { packageId: "monthly", name: "Path To Mastery", price: 2000, durationDays: 720, credit: 5000 },
];

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Biology",
  "ICT",
  "Bangla",
  "Economics",
];

const highlights = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Verified teachers",
    text: "Learn one-on-one with teachers screened for subject skill, communication, and reliability.",
  },
  {
    icon: <FaVideo />,
    title: "Live classroom",
    text: "Use video, chat, and whiteboard tools in one focused session without extra setup.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Flexible plans",
    text: "Start small, top up when needed, or choose a weekly/monthly package for regular learning.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Safer learning",
    text: "Private sessions, secure payments, and simple progress visibility for students and parents.",
  },
];

const steps = [
  "Create a student account",
  "Choose a package",
  "Pick a teacher or subject",
  "Join the live session",
];

export default function Home() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const downloadPoperl = async () => {
    try {
      const res = await axiosSecure.get("/download-link");
      const link = document.createElement("a");
      link.href = res.data.url;
      link.setAttribute("download", "PoperL.apk");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="poperl-home">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="PoperL home">
            <img src={logo} alt="PoperL" />
          </Link>
          <nav className="header-nav">
            <a href="#subjects">Subjects</a>
            <a href="#packages">Pricing</a>
            <Link to="/about">About</Link>
            <Link to="/teacherSignUp">Teach</Link>
          </nav>
          <button className="btn-outline-white" onClick={() => navigate("/signin")}>
            Sign in
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-media" aria-hidden="true">
            <img src={sliderImg1} alt="" />
          </div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="section-label">Online tutoring for Bangladesh</span>
              <h1>Learn live with the right teacher, when you need help.</h1>
              <p>
                PoperL connects students with verified tutors for focused video sessions, shared whiteboard work,
                and direct chat across core school, college, and skill subjects.
              </p>
              <div className="hero-ctas">
                <button className="btn-hero-primary" onClick={() => navigate("/signin")}>
                  Start learning <FaArrowRight />
                </button>
                <button className="btn-hero-secondary" onClick={downloadPoperl}>
                  <FaMobileAlt /> Download app
                </button>
              </div>
            </div>

            <div className="hero-panel">
              <div className="panel-row">
                <FaBookOpen />
                <span>50+ subjects</span>
              </div>
              <div className="panel-row">
                <FaComments />
                <span>Chat and whiteboard support</span>
              </div>
              <div className="panel-row">
                <FaCheckCircle />
                <span>Pay only for the plan you choose</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section" aria-label="PoperL stats">
          <div className="stat-card">
            <strong>500+</strong>
            <span>Teacher profiles</span>
          </div>
          <div className="stat-card">
            <strong>50+</strong>
            <span>Subjects covered</span>
          </div>
          <div className="stat-card">
            <strong>24/7</strong>
            <span>Learning access</span>
          </div>
          <div className="stat-card">
            <strong>1:1</strong>
            <span>Private sessions</span>
          </div>
        </section>

        <section className="why-section">
          <div className="container">
            <span className="section-label">Why PoperL</span>
            <h2 className="section-title">A cleaner way to get unstuck.</h2>
            <div className="why-grid">
              {highlights.map((item) => (
                <article className="why-card" key={item.title}>
                  <div className="why-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="subjects-section" id="subjects">
          <div className="container split-section">
            <div>
              <span className="section-label">Subjects</span>
              <h2 className="section-title">Find help for the class you are in right now.</h2>
            </div>
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <button className="subject-card" key={subject} onClick={() => navigate("/signin")}>
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="container">
            <span className="section-label">How it works</span>
            <h2 className="section-title">From question to session in four steps.</h2>
            <div className="steps-grid">
              {steps.map((step, index) => (
                <article className="step-card" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="packages-section" id="packages">
          <div className="container">
            <span className="section-label">Pricing</span>
            <h2 className="section-title">Choose a package that matches your pace.</h2>
            <div className="packages-grid">
              {packages.map((pkg) => (
                <Pack key={pkg.packageId} {...pkg} />
              ))}
            </div>
          </div>
        </section>

        <section className="app-section">
          <div className="container app-inner">
            <div>
              <span className="section-label">Mobile app</span>
              <h2 className="section-title">Take the classroom with you.</h2>
              <p>
                Download the Android app for fast access to teachers, session chat, and learning packages from your
                phone.
              </p>
            </div>
            <div className="app-actions">
              <button className="btn-hero-primary" onClick={downloadPoperl}>
                <FaMobileAlt /> Download APK
              </button>
              <Link className="btn-hero-secondary" to="/about">
                Learn about PoperL <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <div>
              <h2>Ready to learn with a real teacher?</h2>
              <p>Create an account, choose your package, and start with the subject you need most.</p>
            </div>
            <button className="btn-hero-primary" onClick={() => navigate("/signin")}>
              Get started <FaArrowRight />
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <img src={logo} alt="PoperL" />
          <div>
            <Link to="/about">About</Link>
            <Link to="/teacherSignUp">Become a teacher</Link>
            <Link to="/signin">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
