import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapPage.css";

// Fix default blue marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component for flying map to new location
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.4 });
  }, [position]);
  return null;
}

function MapPage() {
  const [events, setEvents] = useState([]);          // All events
  const [search, setSearch] = useState("");          // Search input
  const [flyToPos, setFlyToPos] = useState(null);    // Fly-to position

  const markerRefs = useRef({});

  // Fetch all events on load
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch("https://connect-web-application.onrender.com/api/events");
      const json = await res.json();

      if (json.success && json.data) {
        setEvents(json.data);
      }
    } catch (err) {
      console.error("Failed loading events:", err);
    }
  };

  // Search for event
  const searchEvent = async () => {
    console.log("Search button clicked. Input:", search);

    if (!search.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const res = await fetch(
        `https://connect-web-application.onrender.com/api/events/search?q=${encodeURIComponent(
          search
        )}`
      );

      const json = await res.json();
      console.log("Search result:", json);

      const resultEvents = json.data?.events || [];

      if (resultEvents.length === 0) {
        alert("No matching event found.");
        return;
      }

      const event = resultEvents[0]; // Pick first matched event

      if (!event.coordinates) {
        alert("This event does not have coordinates.");
        return;
      }

      const { lat, lng } = event.coordinates;

      setFlyToPos([lat, lng]);

      const marker = markerRefs.current[event._id] || markerRefs.current[event.id];
      if (marker) marker.openPopup();

    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="map-page">
      <h2>Maps</h2>

      {/* Search Box + Button */}
      <div className="search-row">
        <input
          type="text"
          className="map-search-input"
          placeholder="Search Event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchEvent()}
        />
        <button className="map-search-btn" onClick={searchEvent}>
          Search
        </button>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <MapContainer
          center={[43.65, -79.38]}
          zoom={12}
          scrollWheelZoom={true}
          className="map-container"
        >
          <FlyToLocation position={flyToPos} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Render all event markers */}
          {events.map((ev) => (
            <Marker
              key={ev._id}
              position={[ev.coordinates.lat, ev.coordinates.lng]}
              icon={defaultIcon}
              ref={(ref) => (markerRefs.current[ev._id] = ref)}
            >
              <Popup>
                <b>{ev.title}</b>
                <br />
                📍 {ev.location}
                <br />
                📅 {new Date(ev.date).toLocaleDateString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
