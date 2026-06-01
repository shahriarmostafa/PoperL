import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaBookOpen, FaCheck, FaMoneyBill, FaStar } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function ManageCourses() {
  const axiosSecure = useAxiosSecure();
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [pricingById, setPricingById] = useState({});

  const loadCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      const res = await axiosSecure.get(`/api/admin/courses?${params.toString()}`);
      setCourses(res.data.courses || []);
      const nextPricing = {};
      (res.data.courses || []).forEach((course) => {
        nextPricing[course.id] = {
          session: course.pricing?.session || "",
          monthly: course.pricing?.monthly || "",
          full: course.pricing?.full || "",
          featured: course.featured === true,
        };
      });
      setPricingById(nextPricing);
    } catch (err) {
      Swal.fire("Courses unavailable", err.response?.data?.error || "Could not load courses.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [status]);

  const updatePricing = (courseId, patch) => {
    setPricingById((prev) => ({ ...prev, [courseId]: { ...(prev[courseId] || {}), ...patch } }));
  };

  const approveCourse = async (course, rejected = false) => {
    try {
      await axiosSecure.patch(`/api/admin/courses/${course.id}/approve`, {
        pricing: pricingById[course.id] || {},
        status: rejected ? "rejected" : "published",
        featured: pricingById[course.id]?.featured === true,
      });
      loadCourses();
      Swal.fire(rejected ? "Rejected" : "Published", rejected ? "Course was rejected." : "Course is live in marketplace.", "success");
    } catch (err) {
      Swal.fire("Could not update", err.response?.data?.error || "Please add valid pricing.", "error");
    }
  };

  const payTeacher = async (course) => {
    try {
      const res = await axiosSecure.post(`/api/admin/courses/${course.id}/pay-teacher`, {});
      loadCourses();
      Swal.fire("Payment marked", `Payable: ${res.data.payment.amount}. Total points added: ${res.data.payment.pointsAdded}.`, "success");
    } catch (err) {
      Swal.fire("Could not pay", err.response?.data?.error || "Please try again.", "error");
    }
  };

  return (
    <div className="analytics">
      <div className="manage-subjects manage-courses">
        <div className="subjects-header">
          <FaBookOpen className="subjects-header-icon" />
          <h2 className="headline">Course Marketplace</h2>
        </div>

        <div className="subjects-filters">
          <div className="filter-group">
            {["", "pending", "published", "rejected", "completed"].map((item) => (
              <button className={`filter-btn ${status === item ? "active" : ""}`} type="button" key={item || "all"} onClick={() => setStatus(item)}>
                {item || "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="subjects-list course-admin-list">
          {loading ? (
            <div className="subjects-loading">Loading...</div>
          ) : courses.length ? courses.map((course) => {
            const pricing = pricingById[course.id] || {};
            const earnings = course.earnings || {};
            return (
              <div className="subject-item course-admin-card" key={course.id}>
                <div className="subject-name">
                  {course.title}
                  <small>
                    {course.subject || "Subject"} · {course.status} · {course.teacher?.displayName || course.teacherId} · {course.studentCount}/{course.capacity}
                  </small>
                  <small>
                    Performance {(Number(earnings.performance?.weightedScore) * 100 || 0).toFixed(0)}% · Payable ৳{earnings.teacherPayable || 0} · Points {earnings.totalPointsToAdd || 0}
                  </small>
                </div>
                <div className="course-admin-pricing">
                  <input type="number" placeholder="Session credit" value={pricing.session} onChange={(event) => updatePricing(course.id, { session: event.target.value })} />
                  <input type="number" placeholder="Monthly credit" value={pricing.monthly} onChange={(event) => updatePricing(course.id, { monthly: event.target.value })} />
                  <input type="number" placeholder="Full credit" value={pricing.full} onChange={(event) => updatePricing(course.id, { full: event.target.value })} />
                  <label><input type="checkbox" checked={pricing.featured === true} onChange={(event) => updatePricing(course.id, { featured: event.target.checked })} /> Featured</label>
                </div>
                <div className="subject-actions">
                  <button className="subject-btn" type="button" onClick={() => approveCourse(course)} title="Approve">
                    <FaCheck />
                  </button>
                  <button className="subject-btn delete-btn" type="button" onClick={() => approveCourse(course, true)} title="Reject">
                    x
                  </button>
                  <button className="subject-btn" type="button" onClick={() => payTeacher(course)} title="Pay teacher">
                    <FaMoneyBill />
                  </button>
                  <span className="context-pill"><FaStar /> {course.averageRating || "New"}</span>
                </div>
              </div>
            );
          }) : (
            <div className="subjects-empty">
              <FaBookOpen />
              <p>No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
