import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaBook } from "react-icons/fa";

const CATEGORIES = [
  { label: "School", value: "school" },
  { label: "College", value: "college" },
  { label: "University", value: "university" },
];

const TYPES = [
  { label: "Bangla Medium", value: "bangla_medium" },
  { label: "English Medium", value: "english_medium" },
];

export default function ManageSubjects() {
  const axiosSecure = useAxiosSecure();
  const [selectedCategory, setSelectedCategory] = useState("school");
  const [selectedType, setSelectedType] = useState("bangla_medium");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/subjects?category=${selectedCategory}&type=${selectedType}`
      );
      if (res.data.success) setSubjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, selectedCategory, selectedType]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newSubject.trim();
    if (!name) return;
    setAdding(true);
    try {
      const res = await axiosSecure.post("/subjects", {
        name,
        category: selectedCategory,
        type: selectedType,
      });
      if (res.data.success) {
        setNewSubject("");
        fetchSubjects();
        Swal.fire({ title: "Subject added!", icon: "success", timer: 1400, showConfirmButton: false });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        Swal.fire({ title: "Subject already exists", icon: "warning", timer: 1600, showConfirmButton: false });
      } else {
        console.error(err);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BD2130",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (subject) => {
    setEditingId(subject._id);
    setEditingName(subject.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await axiosSecure.put(`/subjects/${id}`, { name });
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const categoryLabel = CATEGORIES.find((c) => c.value === selectedCategory)?.label;
  const typeLabel = TYPES.find((t) => t.value === selectedType)?.label;

  return (
    <div className="analytics">
      <div className="manage-subjects">
        <div className="subjects-header">
          <FaBook className="subjects-header-icon" />
          <h2 className="headline">Manage Subjects</h2>
        </div>

        <div className="subjects-filters">
          <div className="subjects-filter-row">
            <span className="filter-label">Category</span>
            <div className="filter-group">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`filter-btn ${selectedCategory === cat.value ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="subjects-filter-row">
            <span className="filter-label">Medium</span>
            <div className="filter-group">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  className={`filter-btn ${selectedType === t.value ? "active" : ""}`}
                  onClick={() => setSelectedType(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form className="subjects-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder={`New subject for ${categoryLabel} · ${typeLabel}`}
            disabled={adding}
          />
          <button type="submit" disabled={adding || !newSubject.trim()}>
            <FaPlus />
            <span>{adding ? "Adding…" : "Add Subject"}</span>
          </button>
        </form>

        <div className="subjects-context-tag">
          <span className="context-pill category-pill">{categoryLabel}</span>
          <span className="context-pill type-pill">{typeLabel}</span>
          <span className="subjects-count">{subjects.length} subject{subjects.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="subjects-list">
          {loading ? (
            <div className="subjects-loading">Loading…</div>
          ) : subjects.length === 0 ? (
            <div className="subjects-empty">
              <FaBook />
              <p>No subjects added yet for {categoryLabel} · {typeLabel}</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject._id} className="subject-item">
                {editingId === subject._id ? (
                  <>
                    <input
                      className="subject-edit-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(subject._id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <div className="subject-actions">
                      <button
                        className="subject-btn save-btn"
                        onClick={() => saveEdit(subject._id)}
                        title="Save"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="subject-btn cancel-btn"
                        onClick={cancelEdit}
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="subject-name">{subject.name}</span>
                    <div className="subject-actions">
                      <button
                        className="subject-btn edit-btn"
                        onClick={() => startEdit(subject)}
                        title="Rename"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="subject-btn delete-btn"
                        onClick={() => handleDelete(subject._id, subject.name)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
