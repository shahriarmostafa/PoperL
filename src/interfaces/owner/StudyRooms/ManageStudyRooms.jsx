import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaChalkboardTeacher, FaEdit, FaPlus, FaTrash, FaUserPlus, FaUsers } from "react-icons/fa";
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

const defaultForm = {
  name: "",
  visibility: "public",
  category: "school",
  type: "bangla_medium",
  maxStudents: 10,
  freeAccess: true,
  creditExpenseEnabled: false,
  teacherControl: false,
};

export default function ManageStudyRooms() {
  const axiosSecure = useAxiosSecure();
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [teacherForm, setTeacherForm] = useState({ teacherId: "", subject: "" });
  const [form, setForm] = useState(defaultForm);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || rooms[0] || null;

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/admin/study-rooms");
      const nextRooms = res.data.rooms || [];
      setRooms(nextRooms);
      setSelectedRoomId((current) => (nextRooms.some((room) => room.id === current) ? current : nextRooms[0]?.id || ""));
    } catch (err) {
      setRooms([]);
      Swal.fire("Could not load rooms", err.response?.data?.error || "Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await axiosSecure.get(`/subjects?category=${form.category}&type=${form.type}`);
      const names = res.data.success ? res.data.data.map((subject) => subject.name) : [];
      setSubjects(names);
      setTeacherForm((prev) => ({ ...prev, subject: names.includes(prev.subject) ? prev.subject : names[0] || "" }));
    } catch {
      setSubjects([]);
    }
  }, [axiosSecure, form.category, form.type]);

  const fetchTeachers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ category: form.category, type: form.type });
      if (teacherForm.subject) params.append("subject", teacherForm.subject);
      const res = await axiosSecure.get(`/ActiveTeacherList?${params.toString()}`);
      const nextTeachers = res.data.teachers || [];
      setTeachers(nextTeachers);
      setTeacherForm((prev) => ({
        ...prev,
        teacherId: nextTeachers.some((teacher) => teacher.uid === prev.teacherId)
          ? prev.teacherId
          : nextTeachers[0]?.uid || "",
      }));
    } catch {
      setTeachers([]);
    }
  }, [axiosSecure, form.category, form.type, teacherForm.subject]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const syncSelectedRoomToForm = (room) => {
    if (!room) return;
    setSelectedRoomId(room.id);
    setForm({
      name: room.name || "",
      visibility: room.visibility || "public",
      category: room.category || "school",
      type: room.type || "bangla_medium",
      maxStudents: room.maxStudents || 10,
      freeAccess: room.freeAccess !== false,
      creditExpenseEnabled: room.creditExpenseEnabled === true,
      teacherControl: room.teacherControl === true,
    });
  };

  const resetCreate = () => {
    setSelectedRoomId("");
    setForm(defaultForm);
  };

  const saveRoom = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      Swal.fire("Room name required", "Add a room name first.", "info");
      return;
    }
    setSaving(true);
    try {
      if (selectedRoomId) {
        await axiosSecure.patch(`/api/admin/study-rooms/${selectedRoomId}`, form);
      } else {
        await axiosSecure.post("/api/admin/study-rooms", form);
      }
      await fetchRooms();
      Swal.fire({ title: selectedRoomId ? "Room updated" : "Room created", icon: "success", timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Could not save room", err.response?.data?.error || "Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (room) => {
    const result = await Swal.fire({
      title: "Delete room?",
      text: `${room.name} and its room chats will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#BD2130",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.delete(`/api/admin/study-rooms/${room.id}`);
      await fetchRooms();
    } catch (err) {
      Swal.fire("Could not delete", err.response?.data?.error || "Please try again.", "error");
    }
  };

  const addStudent = async (event) => {
    event.preventDefault();
    if (!selectedRoom?.id || !studentEmail.trim()) return;
    try {
      await axiosSecure.post(`/api/admin/study-rooms/${selectedRoom.id}/students`, { email: studentEmail });
      setStudentEmail("");
      await fetchRooms();
    } catch (err) {
      Swal.fire("Could not add student", err.response?.data?.error || "Please try again.", "error");
    }
  };

  const removeStudent = async (studentId) => {
    try {
      await axiosSecure.delete(`/api/admin/study-rooms/${selectedRoom.id}/students/${studentId}`);
      await fetchRooms();
    } catch (err) {
      Swal.fire("Could not remove student", err.response?.data?.error || "Please try again.", "error");
    }
  };

  const addTeacher = async (event) => {
    event.preventDefault();
    if (!selectedRoom?.id || !teacherForm.teacherId) return;
    try {
      await axiosSecure.post(`/api/admin/study-rooms/${selectedRoom.id}/teachers`, teacherForm);
      await fetchRooms();
    } catch (err) {
      Swal.fire("Could not add teacher", err.response?.data?.error || "Please try again.", "error");
    }
  };

  const removeTeacher = async (chatId) => {
    try {
      await axiosSecure.delete(`/api/admin/study-rooms/${selectedRoom.id}/teachers/${chatId}`);
      await fetchRooms();
    } catch (err) {
      Swal.fire("Could not remove teacher", err.response?.data?.error || "Please try again.", "error");
    }
  };

  return (
    <div className="analytics">
      <div className="manage-subjects manage-study-rooms">
        <div className="subjects-header">
          <FaUsers className="subjects-header-icon" />
          <h2 className="headline">Manage Study Rooms</h2>
        </div>

        <form className="subjects-add-form study-room-admin-form" onSubmit={saveRoom}>
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Room name" />
          <select value={form.visibility} onChange={(event) => setForm((prev) => ({ ...prev, visibility: event.target.value }))}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}>
            {CATEGORIES.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
          </select>
          <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
            {TYPES.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
          </select>
          <input type="number" min="1" value={form.maxStudents} onChange={(event) => setForm((prev) => ({ ...prev, maxStudents: event.target.value }))} placeholder="Max students" />
          <label className="admin-room-check"><input type="checkbox" checked={form.freeAccess} onChange={(event) => setForm((prev) => ({ ...prev, freeAccess: event.target.checked }))} /> Free access</label>
          <label className="admin-room-check"><input type="checkbox" checked={form.creditExpenseEnabled} onChange={(event) => setForm((prev) => ({ ...prev, creditExpenseEnabled: event.target.checked }))} /> Credit expense</label>
          <label className="admin-room-check"><input type="checkbox" checked={form.teacherControl} onChange={(event) => setForm((prev) => ({ ...prev, teacherControl: event.target.checked }))} /> Teacher control</label>
          <button type="submit" disabled={saving}>
            <FaPlus />
            <span>{saving ? "Saving..." : selectedRoomId ? "Save Room" : "Create Room"}</span>
          </button>
          {selectedRoomId && <button type="button" onClick={resetCreate}>New</button>}
        </form>

        <div className="subjects-context-tag">
          <span className="subjects-count">{rooms.length} room{rooms.length !== 1 ? "s" : ""}</span>
          {selectedRoom && <span className="context-pill category-pill">{selectedRoom.keyword}</span>}
        </div>

        <div className="admin-room-layout">
          <div className="subjects-list">
            {loading ? (
              <div className="subjects-loading">Loading...</div>
            ) : rooms.length ? rooms.map((room) => (
              <div className={`subject-item ${selectedRoom?.id === room.id ? "active" : ""}`} key={room.id}>
                <span className="subject-name">
                  {room.name}
                  <small> - {room.keyword} - {room.visibility} - {room.memberCount}/{room.maxStudents}</small>
                </span>
                <div className="subject-actions">
                  <button className="subject-btn edit-btn" type="button" onClick={() => syncSelectedRoomToForm(room)} title="Edit">
                    <FaEdit />
                  </button>
                  <button className="subject-btn delete-btn" type="button" onClick={() => deleteRoom(room)} title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            )) : (
              <div className="subjects-empty"><FaUsers /><p>No rooms yet.</p></div>
            )}
          </div>

          {selectedRoom && (
            <div className="admin-room-detail">
              <h3>{selectedRoom.name}</h3>
              <p>{selectedRoom.keyword} - {selectedRoom.category} - {selectedRoom.type}</p>

              <form className="admin-room-inline-form" onSubmit={addStudent}>
                <input value={studentEmail} onChange={(event) => setStudentEmail(event.target.value)} placeholder="Student email" />
                <button type="submit"><FaUserPlus /> Add</button>
              </form>

              <div className="admin-room-member-list">
                {(selectedRoom.members || []).map((student) => (
                  <span key={student.uid}>
                    {student.displayName || student.email || student.uid}
                    <button type="button" onClick={() => removeStudent(student.uid)}><FaTrash /></button>
                  </span>
                ))}
              </div>

              <form className="admin-room-inline-form" onSubmit={addTeacher}>
                <select value={teacherForm.subject} onChange={(event) => setTeacherForm((prev) => ({ ...prev, subject: event.target.value }))}>
                  {subjects.length ? subjects.map((subject) => <option value={subject} key={subject}>{subject}</option>) : <option value="">Subject</option>}
                </select>
                <select value={teacherForm.teacherId} onChange={(event) => setTeacherForm((prev) => ({ ...prev, teacherId: event.target.value }))}>
                  {teachers.length ? teachers.map((teacher) => <option value={teacher.uid} key={teacher.uid}>{teacher.displayName || teacher.email}</option>) : <option value="">Teacher</option>}
                </select>
                <button type="submit"><FaChalkboardTeacher /> Add</button>
              </form>

              <div className="admin-room-member-list teacher-list">
                {(selectedRoom.teacherSessions || []).map((session) => (
                  <span key={session.chatId}>
                    {session.teacher?.displayName || session.name} - {session.subject || "General"}
                    <button type="button" onClick={() => removeTeacher(session.chatId)}><FaTrash /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
