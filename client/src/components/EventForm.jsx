import React, { useState } from "react";
import { api } from "../apis/client";
import "./EventForm.css";

function EventForm({ onClose, onEventCreated }) {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert to proper payload for backend
    const payload = {
      title: form.title,
      description: form.description,
      city: form.city,
      location: form.location,
      date: new Date(form.date).toISOString(), // FIXED DATE
      startTime: form.startTime,
      endTime: form.endTime,
      capacity: Number(form.capacity), // MUST be number
      interests: form.interest
        ? form.interest.split(",").map((i) => i.trim())
        : [],
      image: form.image || ""
    };

    console.log("SUBMIT PAYLOAD:", payload);

    try {
      const res = await api.post("/api/events", payload);

      console.log("CREATE EVENT RESPONSE:", res.data);

      // Treat any valid returned event object as success
        if (res.data) {
        const eventData = res.data.data || res.data;  // backend sometimes wraps, sometimes raw

        onEventCreated(eventData);
        onClose();
        return;
        }
        alert("Failed to create event. Check console.");
    } catch (err) {
      console.error("Create event error:", err);
      alert("Unable to create event.");
    }
  };

  return (
    <div className="event-form-modal">
      <div className="event-form-container">
        <h2>Create New Event</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Event Title"
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City (e.g., Toronto)"
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Full Address (e.g., 55 Gould St, Toronto, ON)"
            onChange={handleChange}
            required
          />

          <input
            name="date"
            type="date"
            onChange={handleChange}
            required
          />

          <input
            name="startTime"
            placeholder="Start Time (HH:MM)"
            onChange={handleChange}
            required
          />

          <input
            name="endTime"
            placeholder="End Time (HH:MM)"
            onChange={handleChange}
            required
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity (max participants)"
            onChange={handleChange}
            required
          />

          <input
            name="interest"
            placeholder="Interest Tags (comma separated: AI, Coding)"
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Image URL (optional)"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Event Description"
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Create Event
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
