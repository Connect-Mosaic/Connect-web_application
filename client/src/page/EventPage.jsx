import React from "react";
import { Link } from "react-router-dom";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";

function EventPage() {
  return (
    <div className="events-container">
      
      {/* Header Section */}
      <header className="events-header">
        <h1>Events Near You</h1>
        <p>Discover university events based on your interests and location.</p>

        {/* Filters (no functionality yet) */}
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

        {/* 
          Replace EventList items with clickable Event cards.
          The EventList component should internally use <Link> 
          for each event:   <Link to={`/events/${event._id}`}>
        */}
        <div className="events-grid">
          <EventList />
        </div>
      </section>
    </div>
  );
}

export default EventPage;
