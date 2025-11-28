import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../apis/client";
import EventForm from "../components/EventForm";
import "./EventPage.css";

function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (isoString) => {
    if (!isoString) return "Unknown";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoin = async (eventId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in to join an event.");
        return;
      }

      const res = await api.post(`/api/events/${eventId}/join`, {
        userId: user._id,
      });

      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId
            ? { ...ev, participants: res.data.participants }
            : ev
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to join event.");
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-container">
      
      {/* ============================ */}
      {/* Header (Purple Background)   */}
      {/* ============================ */}
      <header className="events-header">
        <h1>Events Near You</h1>
        <p>Discover university events based on your interests and location.</p>

        <div className="filter-bar">
          <select>
            <option>Filter by City</option>
          </select>

          <select>
            <option>Filter by Interest</option>
          </select>

          <input type="text" placeholder="Search events..." />

          <EventForm
            onEventCreated={(newEvent) => setEvents([...events, newEvent])}
          />
        </div>
      </header>

      {/* ============================ */}
      {/* All Events (White Section)   */}
      {/* ============================ */}
      <section className="events-list-section">
        <h2>All Events</h2>

        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-top">
                <div className="event-image">
                  <img
                    src={event.image || "/no-image.png"}
                    alt={event.title}
                  />
                </div>

                <div className="event-info">
                  <h3>{event.title}</h3>

                  <p>
                    <strong>Date:</strong> {formatDate(event.date)}
                  </p>

                  <p>
                    <strong>Time:</strong> {event.startTime} – {event.endTime}
                  </p>

                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>

                </div>
              </div>

              <div className="event-description">
                <h4>Description</h4>
                <p>{event.description}</p>
              </div>

              <div className="event-participants">
                <h4>Participants</h4>

                {event.participants?.length > 0 ? (
                  <ul>
                    {event.participants.map((user, index) => (
                      <li key={user._id || index}>
                        {user.first_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.email || "Unknown User"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No participants yet.</p>
                )}
              </div>

              {/* Join + Edit Buttons */}
              <div className="event-actions">
                <button onClick={() => handleJoin(event.id)}>Join Event</button>

                <Link to={`/events/${event.id}/edit`} className="edit-btn">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default EventPage;
