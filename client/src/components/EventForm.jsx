import React, { useState, useEffect } from "react";
import { api } from "../apis/client";
import "./EventForm.css";

function EventForm({
  mode = "create",
  initialData = {},
  onSubmit,
  onEventCreated,
  onClose
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    interest: "",
    image: ""
  });

  const [error, setError] = useState("");

  /* ============================================================
     LOAD EXISTING EVENT DATA (EDIT MODE)
     Safe: only runs when initialData._id changes
  ============================================================ */
  useEffect(() => {
    if (!initialData || !initialData._id) return;

    setForm({
      title: initialData.title || "",
      description: initialData.description || "",
      city: initialData.city || "",
      location: initialData.location || "",
      date: initialData.date ? initialData.date.substring(0, 10) : "",
      startTime: initialData.startTime || "",
      endTime: initialData.endTime || "",
      capacity: initialData.capacity || "",
      interest: initialData.interests ? initialData.interests.join(", ") : "",
      image: initialData.image || ""
    });
  }, [initialData?._id]);

  /* ============================================================
     FORM FIELD UPDATE
  ============================================================ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ============================================================
     SUBMIT HANDLER (Create or Edit)
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      city: form.city,
      location: form.location,
      date: new Date(form.date).toISOString(),
      startTime: form.startTime,
      endTime: form.endTime,
      capacity: Number(form.capacity),
      interests: form.interest
        ? form.interest.split(",").map((i) => i.trim())
        : [],
      image: form.image
    };

    try {
      if (mode === "edit") {
        await onSubmit(payload); // parent handles updateEvent
        if (onClose) onClose();
        return;
      }

      // CREATE MODE
      const auth = JSON.parse(localStorage.getItem("jwt"));

      const res = await api.post("/api/events", payload, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });

      const eventData = res.data?.data || res.data;

      if (onEventCreated) onEventCreated(eventData);
      if (onClose) onClose();
    } catch (err) {
      console.error("Event save error:", err);
      setError("Failed to save event.");
    }
  };

  /* ============================================================
     UI RENDER
  ============================================================ */
  return (
    <div className="event-form-modal">
      <div className="event-form-container">
        <h2>{mode === "edit" ? "Edit Event" : "Create New Event"}</h2>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City (e.g., Toronto)"
            value={form.city}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Full Address (e.g., 55 Gould St, Toronto, ON)"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          <input
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={handleChange}
            required
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <input
            name="interest"
            placeholder="Interest Tags (AI, Coding)"
            value={form.interest}
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {mode === "edit" ? "Save Changes" : "Create Event"}
            </button>

            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
