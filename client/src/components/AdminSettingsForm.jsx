import React, { useState, useEffect } from "react";
import "./AdminSettingsForm.css";

function AdminSettingsForm() {
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    allowRegistration: true,
    defaultUserRole: "student",
    maxUploadSize: 5,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("jwt");

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      } else {
        console.error("Failed to fetch settings:", data.message);
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:3000/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to save settings" });
      }
    } catch (err) {
      console.error("Settings save error:", err);
      setMessage({ type: "error", text: "Error saving settings" });
    }
    setSaving(false);
  };

  if (loading) {
    return <p className="loading-text">Loading settings...</p>;
  }

  return (
    <div className="settings-container">
      <h2 className="settings-title">Admin Settings</h2>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3>General Settings</h3>

          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              placeholder="Enter site name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              placeholder="Enter site description"
              rows="3"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>User Settings</h3>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="allowRegistration"
              name="allowRegistration"
              checked={settings.allowRegistration}
              onChange={handleChange}
            />
            <label htmlFor="allowRegistration">Allow New User Registration</label>
          </div>

          <div className="form-group">
            <label htmlFor="defaultUserRole">Default User Role</label>
            <select
              id="defaultUserRole"
              name="defaultUserRole"
              value={settings.defaultUserRole}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="organizer">Organizer</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>System Settings</h3>

          <div className="form-group">
            <label htmlFor="maxUploadSize">Max Upload Size (MB)</label>
            <input
              type="number"
              id="maxUploadSize"
              name="maxUploadSize"
              value={settings.maxUploadSize}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
            <label htmlFor="maintenanceMode">Maintenance Mode</label>
            <p className="help-text">
              When enabled, only admins can access the site.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettingsForm;
