import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../apis/client";
import "./EventDetail.css";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
      alert("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!currentUser) {
      alert("You must be logged in to join an event.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:3000/api/events/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("Join response:", data);
      
      if (response.ok) {
        await fetchEvent();
        alert("Successfully joined the event!");
      } else {
        alert(data.message || "Failed to join event.");
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("Failed to join event. Please try again.");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Unknown";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUserOrganizer = () => {
    if (!currentUser || !event?.organizer) return false;
    // Check both possible formats: object with _id or just the ID string
    return event.organizer._id === currentUser._id || event.organizer === currentUser._id;
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-container">
        <Link to="/events" className="back-button">← Back to Events</Link>
        <p>Event not found.</p>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <Link to="/events" className="back-button">← Back to Events</Link>

      <div className="event-details-header">
        <img
          src={event.image || "/no-image.png"}
          alt={event.title}
          className="event-details-image"
        />

        <div className="event-details-info">
          <h1>{event.title}</h1>

          <p><strong>Date:</strong> {formatDate(event.date)}</p>
          <p><strong>Time:</strong> {formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
          <p><strong>Location:</strong> {event.location}</p>

          {event.organizer && (
            <p>
              <strong>Organized by:</strong>{" "}
              {event.organizer.first_name 
                ? `${event.organizer.first_name} ${event.organizer.last_name}`
                : event.organizer.email || "Unknown Organizer"
              }
            </p>
          )}

          {event.capacity && (
            <p>
              <strong>Capacity:</strong> {event.participants?.length || 0} / {event.capacity}
            </p>
          )}

          <div className="event-tags">
            {event.interests?.map((tag, i) => (
              <span key={i} className="event-tag">{tag}</span>
            ))}
          </div>

          <div className="event-details-actions">
            <button className="details-join-btn" onClick={handleJoin}>
              Join Event
            </button>

            {/* EDIT BUTTON - Only show for event organizer */}
            {isUserOrganizer() && (
              <Link to={`/events/${id}/edit`} className="details-edit-btn">
                Edit Event
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="event-description-box">
        <h2>Description</h2>
        <p>{event.description || "No description available."}</p>
      </div>

      <div className="event-participants-box">
        <h2>Participants ({event.participants?.length || 0})</h2>

        {event.participants?.length > 0 ? (
          <div className="participants-list">
            {event.participants.map((user, index) => (
              <div key={user._id || index} className="participant-item">
                <div className="participant-avatar"></div>
                <div className="participant-info">
                  <span className="participant-name">
                    {user.first_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.email || "Unknown User"
                    }
                  </span>
                  {user._id === currentUser?._id && (
                    <span className="participant-you">(You)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-participants">No participants yet.</p>
        )}
      </div>
    </div>
  );
}

export default EventDetail;