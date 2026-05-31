import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBookOpen,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaComments,
  FaDownload,
  FaExclamationTriangle,
  FaFolderOpen,
  FaMobileAlt,
  FaShieldAlt,
  FaVideo,
} from "react-icons/fa";
import "./home.css";
import logo from "/logo-blue.png";
import sliderImg1 from "../../../assests/slider-image-1.jpg";
import Pack from "./Pack";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import usePackages from "../../../Hooks/usePackages";

const fallbackPackages = [
  { packageId: "houry", name: "Basic Hour", price: 50, durationDays: 1, credit: 120, category: "school", type: "bangla_medium" },
  { packageId: "daily", name: "Daily Focus", price: 120, durationDays: 24, credit: 250, category: "school", type: "bangla_medium" },
  { packageId: "weekly", name: "Weekly Scholar's", price: 550, durationDays: 168, credit: 1200, category: "school", type: "bangla_medium" },
  { packageId: "monthly", name: "Path To Mastery", price: 2000, durationDays: 720, credit: 5000, category: "school", type: "bangla_medium" },
];

const CATEGORY_LABELS = {
  school: "School",
  college: "College",
  university: "University",
};

const TYPE_LABELS = {
  bangla_medium: "Bangla Medium",
  english_medium: "English Medium",
};

const formatLabel = (value) => {
  if (!value) return "All";
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getPackageId = (durationDays = 0) => {
  if (durationDays <= 1) return "houry";
  if (durationDays < 48) return "daily";
  if (durationDays < 200) return "weekly";
  return "monthly";
};

const normalizePackage = (pkg) => {
  const durationDays = Number(pkg.durationDays) || 0;

  return {
    cardId: pkg._id || pkg.packageId || pkg.name,
    packageId: pkg.packageId || getPackageId(durationDays),
    name: pkg.name,
    price: Number(pkg.price) || 0,
    durationDays,
    credit: Number(pkg.credit) || 0,
    category: pkg.category,
    type: pkg.type,
  };
};

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

const installSteps = [
  {
    icon: <FaDownload />,
    title: "Download",
    text: "Tap the Download APK button and wait until the download finishes.",
  },
  {
    icon: <FaFolderOpen />,
    title: "Find the file",
    text: "Open File Manager, Files, or Downloads on your phone.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Tap the APK",
    text: "Tap the downloaded PoperL APK file to begin installing.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Allow if asked",
    text: "If Android asks, allow install permission only for the browser or file manager you are using.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Install and open",
    text: "Tap Install, then open PoperL after the installation is complete.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [isPackageLoading, packageData] = usePackages();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("school");
  const [activeType, setActiveType] = useState("bangla_medium");

  const realPackages = useMemo(() => {
    return packageData.length ? packageData.map(normalizePackage) : fallbackPackages;
  }, [packageData]);

  const categories = useMemo(() => {
    return [...new Set(realPackages.map((pkg) => pkg.category).filter(Boolean))];
  }, [realPackages]);

  const types = useMemo(() => {
    return [...new Set(realPackages.map((pkg) => pkg.type).filter(Boolean))];
  }, [realPackages]);

  const visiblePackages = useMemo(() => {
    const filtered = realPackages.filter((pkg) => {
      const categoryMatches = !activeCategory || pkg.category === activeCategory;
      const typeMatches = !activeType || pkg.type === activeType;
      return categoryMatches && typeMatches;
    });

    return filtered.length ? filtered : realPackages;
  }, [activeCategory, activeType, realPackages]);

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
    } finally {
      setShowInstallModal(true);
    }
  };

  const showInstallSteps = () => {
    setShowInstallModal(false);
    setTimeout(() => {
      document.getElementById("install-guide")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
            <a href="#install-guide">How to install</a>
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
            <div className="package-tabs" aria-label="Package category and medium filters">
              <div className="package-tab-group">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => setActiveCategory(category)}
                  >
                    {CATEGORY_LABELS[category] || formatLabel(category)}
                  </button>
                ))}
              </div>
              <div className="package-tab-group">
                {types.map((type) => (
                  <button
                    key={type}
                    className={activeType === type ? "active" : ""}
                    onClick={() => setActiveType(type)}
                  >
                    {TYPE_LABELS[type] || formatLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="packages-grid">
              {isPackageLoading && !packageData.length ? (
                <div className="package-status">Loading latest packages...</div>
              ) : (
                visiblePackages.map((pkg, index) => (
                  <Pack
                    key={pkg.cardId || pkg.packageId}
                    {...pkg}
                    isPopular={index === visiblePackages.length - 1}
                  />
                ))
              )}
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

        <section className="install-guide-section" id="install-guide">
          <div className="container">
            <div className="install-guide-head">
              <span className="section-label">APK help</span>
              <h2 className="section-title">How to install the app</h2>
              <p>
                Android APK installation is simple, but your phone may ask for one extra permission because the app is
                downloaded from the website instead of the Play Store.
              </p>
            </div>
            <div className="install-steps-grid">
              {installSteps.map((step, index) => (
                <article className="install-step-card" key={step.title}>
                  <div className="install-step-icon">{step.icon}</div>
                  <span>Step {index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
            <div className="install-warning">
              <FaExclamationTriangle />
              <p>
                This warning is normal for apps downloaded outside the Play Store. Only continue if you downloaded the
                APK from the official PoperL website.
              </p>
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

      {showInstallModal && (
        <div className="install-modal-backdrop" role="presentation" onClick={() => setShowInstallModal(false)}>
          <div
            className="install-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="install-modal-icon">
              <FaDownload />
            </div>
            <h2 id="install-modal-title">Your download has started</h2>
            <p>
              After it finishes, open your phone's File Manager or Downloads folder and tap the APK file to install
              PoperL.
            </p>
            <div className="install-modal-warning">
              <FaExclamationTriangle />
              <p>
                Your phone may show a security warning because the app is downloaded from our website instead of the
                Play Store. This is normal for APK files. Please continue only if you downloaded it from the official
                PoperL website.
              </p>
            </div>
            <div className="install-modal-actions">
              <button className="btn-hero-secondary" onClick={() => setShowInstallModal(false)}>
                I understand
              </button>
              <button className="btn-hero-primary" onClick={showInstallSteps}>
                Show install steps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
