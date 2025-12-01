import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../apis/client";
import EventForm from "../components/EventForm";
import "./EventPage.css";

function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

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

      const res = await api.post(`/api/events/${eventId}/join`);
      
      // Simple success check 
      await fetchEvents();
      alert("Successfully joined the event!");
      
    } catch (err) {
      console.error("Join error:", err);
      alert("Failed to join event. Please try again.");
    }
  };

  const isUserOrganizer = (event) => {
    if (!currentUser || !event.organizer) return false;
    return event.organizer._id === currentUser._id;
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-container">
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
                  {/* Clickable Event Title */}
                  <Link to={`/events/${event.id}`} className="event-title-link">
                    <h3>{event.title}</h3>
                  </Link>

                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Time:</strong> {event.startTime} – {event.endTime}</p>
                  <p><strong>Location:</strong> {event.location}</p>

                  {event.organizer && (
                    <p>
                      <strong>Organizer:</strong>{" "}
                      {event.organizer.first_name 
                        ? `${event.organizer.first_name} ${event.organizer.last_name}`
                        : event.organizer.email || "Unknown"
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="event-description">
                <h4>Description</h4>
                <p>{event.description || "No description available."}</p>
              </div>

              <div className="event-participants">
                <h4>Participants ({event.participants?.length || 0})</h4>

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

              <div className="event-actions">
                <button onClick={() => handleJoin(event.id)}>
                  Join Event
                </button>

                {/* Edit Button - Only show for event organizer */}
                {isUserOrganizer(event) && (
                  <Link to={`/events/${event.id}/edit`} className="edit-btn">
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default EventPage;