import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";

function EventPage() {
  const [events,setEvents] = useState([]);
  const [error, setError]  =  useState(null);
  const [loading, setLoading]  =  useState(true);

  useEffect (() => {
    fetch("http://localhost:5000/api/events")
    .then(res => res.json())
    .then(data => {
      setEvents(data);
      setLoading(false);
    })
    .catch(err => { console.error(err);
    setError("Failed to load...");
    setLoading(false);
    } );
  },[]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;



  return (
    <div className="events-container">
      
      {/* Header Section */}
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
          
          <EventForm />
        </div>
      </header>

      {/* Event List Section */}
      <section className="events-list-section">
        <h2>All Events</h2>

        
        <div className="events-list">
          {events.map(event => (
            <div key={event._id} className="event-card">
          
              {/*TOP SECTION */}
              <div className="event-top">
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                </div>
                {/*RIGHT:Title,Date,time,Location */}
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <Link to={`/events/${event._id}`}>View Details</Link>
                </div>


              </div>
              {/*Description Card */}
              <div className="event-description">
                <h4>Description</h4>
                <p>{event.description}</p>

              </div>
              {/*Participant Card */}
              <div className="event-participants">
                <h4>Participants</h4>
                {event.participants?.length > 0 ? (
                  <ul>
                    {event.participants.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                ): ( <p>No participants yet.</p>) 
                }
                <button>Join Event</button>

              </div>
              <hr/>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default EventPage;
