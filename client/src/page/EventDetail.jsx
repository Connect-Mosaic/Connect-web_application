import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../apis/client";
import "./EventDetail.css";
import { joinEvent, leaveEvent } from "../apis/event";
import EventForm from "../components/EventForm";   // ✅ IMPORTANT: Add this import

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false); // ✅ edit modal control

  /* ================================
     LOAD USER
  ================================= */
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("jwt"));
    if (auth?.user) {
      setCurrentUser(auth.user);
    }
  }, []);

  /* ================================
     FETCH EVENT
  ================================= */
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

  /* ================================
     JOIN / LEAVE
  ================================= */
  const hasJoined = () => {
    if (!currentUser || !event?.participants) return false;
    const myId = currentUser.id || currentUser._id;
    return event.participants.some(p => (p._id || p.id) === myId);
  };

  const toggleJoin = async () => {
    try {
      if (hasJoined()) {
        await leaveEvent(id);
      } else {
        await joinEvent(id);
      }
      await fetchEvent();
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Unable to update participation.");
    }
  };

  /* ================================
     ORGANIZER CHECK
  ================================= */
  const isUserOrganizer = () => {
    if (!currentUser || !event?.organizer) return false;

    const myId = currentUser.id || currentUser._id;
    const orgId = event.organizer._id || event.organizer.id;

    return orgId === myId;
  };

  /* ================================
     FORMAT HELPERS
  ================================= */
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================================
     LOADING / NOT FOUND
  ================================= */
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

  /* ================================
     RENDER
  ================================= */
  return (
    <>
      {/* ===========================
          EDIT EVENT MODAL
      ============================ */}
      {showEditForm && (
        <EventForm
          mode="edit"
          initialData={event}
          onSubmit={async (payload) => {
            await api.put(`/api/events/${id}`, payload);
            await fetchEvent();
            setShowEditForm(false);
          }}
          onClose={() => setShowEditForm(false)}
        />
      )}

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
                  : event.organizer.email || "Unknown Organizer"}
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

              {/* JOIN / LEAVE BUTTON */}
              <button
                className={hasJoined() ? "details-join-btn joined" : "details-join-btn"}
                onClick={toggleJoin}
              >
                {hasJoined() ? "✔ Joined (Leave)" : "Join Event"}
              </button>

              {/* EDIT BUTTON */}
              {isUserOrganizer() && (
                <button
                  className="details-edit-btn"
                  onClick={() => setShowEditForm(true)}
                >
                  Edit Event
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="event-description-box">
          <h2>Description</h2>
          <p>{event.description || "No description available."}</p>
        </div>

        {/* PARTICIPANTS */}
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
                        : user.email || "Unknown User"}
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
    </>
  );
}

export default EventDetail;
