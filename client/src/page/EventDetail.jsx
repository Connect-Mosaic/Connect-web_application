import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../apis/client";
import Navbar from "../components/Navbar";  
import Footer from "../components/Footer";  
import "./EventDetail.css";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div>
      {/* Global Navigation */}
      <Navbar />

      <div className="event-details-container">

        {/* Back Button */}
        <Link to="/events" className="back-button">← Back to Events</Link>

        {/* Header Section */}
        <div className="event-details-header">
          <img
            src={event.image || "/no-image.png"}
            alt={event.title}
            className="event-details-image"
          />

          <div className="event-details-info">
            <h1>{event.title}</h1>

            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.startTime} – {event.endTime}</p>
            <p><strong>Location:</strong> {event.location}</p>

            <div className="event-tags">
              {event.interests?.map((tag, i) => (
                <span key={i} className="event-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div className="event-description-box">
          <h2>Description</h2>
          <p>{event.description}</p>
        </div>

        {/* Participants Box */}
        <div className="event-participants-box">
          <h2>Participants</h2>

          <div className="participant-avatars">
            {event.participants?.map((user, index) => (
              <div key={index} className="participant-avatar"></div>
            ))}
          </div>

          <button className="details-join-btn">
            Join Event
          </button>
        </div>

      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default EventDetail;
