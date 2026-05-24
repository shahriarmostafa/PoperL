import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaComments,
  FaMobileAlt,
  FaShieldAlt,
  FaVideo,
} from "react-icons/fa";
import "./home.css";
import logo from "/logo-text.png";

const appDetails = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Teacher matching",
    text: "Students can browse subjects and connect with teachers who fit their learning needs.",
  },
  {
    icon: <FaVideo />,
    title: "Live sessions",
    text: "Classes happen through live video with a shared whiteboard for solving problems together.",
  },
  {
    icon: <FaComments />,
    title: "Learning chat",
    text: "Students and teachers can keep the conversation focused before and after a session.",
  },
  {
    icon: <FaMobileAlt />,
    title: "App access",
    text: "The Android app keeps sessions, packages, and teacher access close at hand.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Controlled experience",
    text: "Private accounts, payments, and role-based areas help keep the learning flow organized.",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="poperl-home about-page">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="PoperL home">
            <img src={logo} alt="PoperL" />
          </Link>
          <nav className="header-nav">
            <Link to="/">Home</Link>
            <Link to="/teacherSignUp">Teach</Link>
            <Link to="/signin">Sign in</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="about-hero">
          <div className="container about-hero-grid">
            <div>
              <button className="back-link" onClick={() => navigate("/")}>
                <FaArrowLeft /> Back home
              </button>
              <span className="section-label">About PoperL</span>
              <h1>What this app is about</h1>
              <p>
                PoperL is an online tutoring platform built to make live, one-on-one learning easier to access.
                The app brings teacher discovery, learning packages, video sessions, whiteboard support, and chat
                into one place.
              </p>
            </div>
            <div className="about-summary">
              <h2>Built for students who need practical help.</h2>
              <p>
                Instead of searching everywhere for a tutor, students can sign in, choose a subject, pick a package,
                and start learning with a verified teacher.
              </p>
            </div>
          </div>
        </section>

        <section className="about-content">
          <div className="container">
            <div className="about-statement">
              <h2>The goal</h2>
              <p>
                PoperL focuses on quick access to quality teaching. It is useful for school and college students,
                exam preparation, language practice, ICT support, and skill-based learning where a real teacher can
                explain the next step clearly.
              </p>
            </div>

            <div className="about-feature-grid">
              {appDetails.map((item) => (
                <article className="about-feature-card" key={item.title}>
                  <div className="why-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-users">
          <div className="container about-users-grid">
            <div>
              <h2>For students</h2>
              <ul>
                <li><FaCheckCircle /> Find teachers by subject.</li>
                <li><FaCheckCircle /> Join live video lessons.</li>
                <li><FaCheckCircle /> Use packages that fit your schedule.</li>
              </ul>
            </div>
            <div>
              <h2>For teachers</h2>
              <ul>
                <li><FaCheckCircle /> Apply to teach online.</li>
                <li><FaCheckCircle /> Work with students in live sessions.</li>
                <li><FaCheckCircle /> Manage learning support through the platform.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <div>
              <h2>Start with the subject you need most.</h2>
              <p>PoperL keeps the path simple: account, package, teacher, session.</p>
            </div>
            <button className="btn-hero-primary" onClick={() => navigate("/signin")}>
              Sign in to continue
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
