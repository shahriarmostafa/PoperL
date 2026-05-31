import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const CATEGORIES = [
  { label: "School", value: "school" },
  { label: "College", value: "college" },
  { label: "University", value: "university" },
];

const TYPES = [
  { label: "Bangla Medium", value: "bangla_medium" },
  { label: "English Medium", value: "english_medium" },
];

export default function ManagePublicQuizzes() {
  const axiosSecure = useAxiosSecure();
  const [selectedCategory, setSelectedCategory] = useState("school");
  const [selectedType, setSelectedType] = useState("bangla_medium");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", teacherId: "" });

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await axiosSecure.get(`/subjects?category=${selectedCategory}&type=${selectedType}`);
      const names = res.data.success ? res.data.data.map((subject) => subject.name) : [];
      setSubjects(names);
      setSelectedSubject((current) => (names.includes(current) ? current : names[0] || ""));
    } catch (err) {
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [axiosSecure, selectedCategory, selectedType]);

  const fetchTeachers = useCallback(async () => {
    if (!selectedSubject) {
      setTeachers([]);
      return;
    }
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        type: selectedType,
        subject: selectedSubject,
      });
      const res = await axiosSecure.get(`/ActiveTeacherList?${params.toString()}`);
      setTeachers(res.data.teachers || []);
      setForm((current) => ({
        ...current,
        teacherId: (res.data.teachers || []).some((teacher) => teacher.uid === current.teacherId)
          ? current.teacherId
          : (res.data.teachers || [])[0]?.uid || "",
      }));
    } catch (err) {
      setTeachers([]);
    }
  }, [axiosSecure, selectedCategory, selectedType, selectedSubject]);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        type: selectedType,
      });
      if (selectedSubject) params.append("subject", selectedSubject);
      const res = await axiosSecure.get(`/api/admin/public-quizzes?${params.toString()}`);
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, selectedCategory, selectedType, selectedSubject]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    fetchTeachers();
    fetchQuizzes();
  }, [fetchTeachers, fetchQuizzes]);

  const createQuiz = async (event) => {
    event.preventDefault();
    if (!selectedSubject || !form.teacherId) {
      Swal.fire("Missing details", "Choose a subject and teacher first.", "info");
      return;
    }
    setCreating(true);
    try {
      await axiosSecure.post("/api/admin/public-quizzes", {
        title: form.title,
        category: selectedCategory,
        type: selectedType,
        subject: selectedSubject,
        teacherId: form.teacherId,
      });
      setForm({ title: "", teacherId: form.teacherId });
      fetchQuizzes();
      Swal.fire({ title: "Public quiz assigned", icon: "success", timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Could not assign quiz", err.response?.data?.error || "Please try again.", "error");
    } finally {
      setCreating(false);
    }
  };

  const deleteQuiz = async (quiz) => {
    const result = await Swal.fire({
      title: "Delete assignment?",
      text: quiz.title || "This public quiz assignment will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#BD2130",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.delete(`/api/admin/public-quizzes/${quiz.id}`);
      fetchQuizzes();
    } catch (err) {
      Swal.fire("Could not delete", err.response?.data?.error || "Please try again.", "error");
    }
  };

  const categoryLabel = CATEGORIES.find((item) => item.value === selectedCategory)?.label;
  const typeLabel = TYPES.find((item) => item.value === selectedType)?.label;

  return (
    <div className="analytics">
      <div className="manage-subjects manage-public-quizzes">
        <div className="subjects-header">
          <FaClipboardList className="subjects-header-icon" />
          <h2 className="headline">Public Quizzes</h2>
        </div>

        <div className="subjects-filters">
          <div className="subjects-filter-row">
            <span className="filter-label">Category</span>
            <div className="filter-group">
              {CATEGORIES.map((category) => (
                <button key={category.value} className={`filter-btn ${selectedCategory === category.value ? "active" : ""}`} onClick={() => setSelectedCategory(category.value)}>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          <div className="subjects-filter-row">
            <span className="filter-label">Medium</span>
            <div className="filter-group">
              {TYPES.map((type) => (
                <button key={type.value} className={`filter-btn ${selectedType === type.value ? "active" : ""}`} onClick={() => setSelectedType(type.value)}>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form className="subjects-add-form" onSubmit={createQuiz}>
          <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)}>
            {subjects.length ? subjects.map((subject) => (
              <option value={subject} key={subject}>{subject}</option>
            )) : (
              <option value="">No subjects</option>
            )}
          </select>
          <select value={form.teacherId} onChange={(event) => setForm((prev) => ({ ...prev, teacherId: event.target.value }))}>
            {teachers.length ? teachers.map((teacher) => (
              <option value={teacher.uid} key={teacher.uid}>{teacher.displayName || teacher.email || "Teacher"}</option>
            )) : (
              <option value="">No teachers</option>
            )}
          </select>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder={`${selectedSubject || "Subject"} quiz title`}
          />
          <button type="submit" disabled={creating || !selectedSubject || !form.teacherId}>
            <FaPlus />
            <span>{creating ? "Assigning..." : "Assign Quiz"}</span>
          </button>
        </form>

        <div className="subjects-context-tag">
          <span className="context-pill category-pill">{categoryLabel}</span>
          <span className="context-pill type-pill">{typeLabel}</span>
          <span className="subjects-count">{quizzes.length} public quiz{quizzes.length !== 1 ? "zes" : ""}</span>
        </div>

        <div className="subjects-list">
          {loading ? (
            <div className="subjects-loading">Loading...</div>
          ) : quizzes.length ? quizzes.map((quiz) => (
            <div className="subject-item" key={quiz.id}>
              <span className="subject-name">
                {quiz.title || quiz.subject}
                <small> · {quiz.subject} · {quiz.status} · {quiz.teacher?.displayName || quiz.teacherId}</small>
              </span>
              <div className="subject-actions">
                {quiz.status !== "completed" && (
                  <button className="subject-btn delete-btn" type="button" onClick={() => deleteQuiz(quiz)} title="Delete">
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="subjects-empty">
              <FaClipboardList />
              <p>No public quiz assigned for {categoryLabel} · {typeLabel}{selectedSubject ? ` · ${selectedSubject}` : ""}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
