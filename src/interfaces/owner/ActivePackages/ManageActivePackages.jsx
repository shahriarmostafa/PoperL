import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEdit, FaSave, FaTimes, FaSearch, FaBoxOpen } from "react-icons/fa";

const CATEGORIES = [
  { label: "School", value: "school" },
  { label: "College", value: "college" },
  { label: "University", value: "university" },
  { label: "Custom", value: "custom" },
];

const TYPES = [
  { label: "Bangla Medium", value: "bangla_medium" },
  { label: "English Medium", value: "english_medium" },
  { label: "Custom", value: "custom" },
];

export default function ManageActivePackages() {
  const axiosSecure = useAxiosSecure();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [editingPkg, setEditingPkg] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterCategory) params.append("category", filterCategory);
      if (filterType) params.append("type", filterType);
      if (filterActive !== "") params.append("active", filterActive);
      const res = await axiosSecure.get(`/active-packages?${params.toString()}`);
      if (res.data.success) setPackages(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, search, filterCategory, filterType, filterActive]);

  useEffect(() => {
    fetchPackages();
  }, [filterCategory, filterType, filterActive]);

  const openEdit = (pkg) => {
    setEditingPkg(pkg);
    setEditForm({
      packageName: pkg.packageName || "",
      category: pkg.category || "school",
      type: pkg.type || "bangla_medium",
      credit: pkg.credit ?? 0,
      totalCredit: pkg.totalCredit ?? 0,
      startDate: pkg.startDate ? pkg.startDate.slice(0, 16) : "",
      expiryDate: pkg.expiryDate ? pkg.expiryDate.slice(0, 16) : "",
      isActive: pkg.isActive ?? true,
      isUnlimited: pkg.isUnlimited ?? false,
    });
  };

  const closeEdit = () => {
    setEditingPkg(null);
    setEditForm({});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosSecure.patch(`/active-packages/${editingPkg.uid}`, {
        ...editForm,
        credit: Number(editForm.credit),
        totalCredit: Number(editForm.totalCredit),
      });
      await fetchPackages();
      closeEdit();
      Swal.fire({ title: "Saved!", icon: "success", timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ title: "Failed to save", icon: "error", confirmButtonColor: "#4E73DF" });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const isExpired = (pkg) => pkg.expiryDate && new Date(pkg.expiryDate) < new Date();

  const activeCount = packages.filter((p) => p.isActive && !isExpired(p)).length;
  const expiredCount = packages.filter((p) => isExpired(p)).length;

  return (
    <div className="analytics">
      <div className="active-packages-page">

        <div className="ap-page-header">
          <FaBoxOpen className="ap-page-icon" />
          <h2 className="headline">Active Packages</h2>
        </div>

        {/* Filters */}
        <div className="ap-filters">
          <form
            className="ap-search-bar"
            onSubmit={(e) => { e.preventDefault(); fetchPackages(); }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by UID or package name…"
            />
            <button type="submit"><FaSearch /></button>
          </form>
          <div className="ap-filter-row">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All mediums</option>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Stats bar */}
        <div className="ap-stats-bar">
          <span className="ap-stat"><b>{packages.length}</b> results</span>
          <span className="ap-stat valid"><b>{activeCount}</b> valid</span>
          <span className="ap-stat expired"><b>{expiredCount}</b> expired</span>
        </div>

        {/* Edit panel */}
        {editingPkg && (
          <div className="ap-edit-panel">
            <div className="ap-edit-head">
              <div className="ap-edit-user">
                <div className="ap-edit-name">{editingPkg.userName || "Unknown User"}</div>
                {editingPkg.email && <div className="ap-edit-email">{editingPkg.email}</div>}
                <div className="ap-edit-uid">{editingPkg.uid}</div>
              </div>
              <button className="ap-close-btn" onClick={closeEdit} disabled={saving}>
                <FaTimes />
              </button>
            </div>

            <div className="ap-edit-grid">
              <label className="ap-field">
                <span>Package Name</span>
                <input
                  value={editForm.packageName}
                  onChange={(e) => setEditForm((p) => ({ ...p, packageName: e.target.value }))}
                />
              </label>
              <label className="ap-field">
                <span>Category</span>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>
              <label className="ap-field">
                <span>Medium</span>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
                >
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </label>
              <label className="ap-field">
                <span>Remaining Credit</span>
                <input
                  type="number"
                  min="0"
                  value={editForm.credit}
                  onChange={(e) => setEditForm((p) => ({ ...p, credit: e.target.value }))}
                />
              </label>
              <label className="ap-field">
                <span>Total Credit</span>
                <input
                  type="number"
                  min="0"
                  value={editForm.totalCredit}
                  onChange={(e) => setEditForm((p) => ({ ...p, totalCredit: e.target.value }))}
                />
              </label>
              <label className="ap-field">
                <span>Start Date</span>
                <input
                  type="datetime-local"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm((p) => ({ ...p, startDate: e.target.value }))}
                />
              </label>
              <label className="ap-field">
                <span>Expiry Date</span>
                <input
                  type="datetime-local"
                  value={editForm.expiryDate}
                  onChange={(e) => setEditForm((p) => ({ ...p, expiryDate: e.target.value }))}
                />
              </label>
              <div className="ap-toggles">
                <label className="ap-toggle">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  <span className="ap-toggle-track" />
                  <span className="ap-toggle-text">Active</span>
                </label>
                <label className="ap-toggle">
                  <input
                    type="checkbox"
                    checked={editForm.isUnlimited}
                    onChange={(e) => setEditForm((p) => ({ ...p, isUnlimited: e.target.checked }))}
                  />
                  <span className="ap-toggle-track" />
                  <span className="ap-toggle-text">Unlimited</span>
                </label>
              </div>
            </div>

            <div className="ap-edit-actions">
              <button className="ap-cancel-btn" onClick={closeEdit} disabled={saving}>
                Cancel
              </button>
              <button className="ap-save-btn" onClick={handleSave} disabled={saving}>
                <FaSave /> {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table">
          {loading ? (
            <div className="text-center w-100 p-3">Loading…</div>
          ) : packages.length === 0 ? (
            <div className="text-center w-100 p-3">No packages found</div>
          ) : (
            <table>
              <tbody>
                <tr>
                  <th>User</th>
                  <th>Package</th>
                  <th>Category / Medium</th>
                  <th>Credits</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
                {packages.map((pkg) => {
                  const expired = isExpired(pkg);
                  const isEditing = editingPkg?.uid === pkg.uid;
                  return (
                    <tr key={pkg.uid} className={expired ? "ap-row-expired" : ""}>
                      <td>
                        <b>{pkg.userName || "—"}</b>
                        <small className="ap-sub-text">{pkg.email || pkg.uid}</small>
                      </td>
                      <td>{pkg.packageName || "—"}</td>
                      <td>
                        <span className="ap-badge cat">{pkg.category || "—"}</span>
                        <span className="ap-badge type">
                          {pkg.type === "bangla_medium" ? "Bangla"
                            : pkg.type === "english_medium" ? "English"
                            : pkg.type || "—"}
                        </span>
                      </td>
                      <td>
                        <b>{pkg.credit ?? "—"}</b>
                        <small className="ap-sub-text">/ {pkg.totalCredit ?? "—"}</small>
                        {pkg.isUnlimited && <span className="ap-badge unlimited">∞</span>}
                      </td>
                      <td>
                        <small>{formatDate(pkg.expiryDate)}</small>
                        {expired && <span className="ap-badge expired">Expired</span>}
                      </td>
                      <td>
                        <span className={`ap-badge ${pkg.isActive ? "active-badge" : "inactive-badge"}`}>
                          {pkg.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="redi-buttons">
                          <button
                            className={isEditing ? "bg-secondary" : "bg-primary"}
                            onClick={() => isEditing ? closeEdit() : openEdit(pkg)}
                          >
                            {isEditing ? <FaTimes /> : <FaEdit />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
