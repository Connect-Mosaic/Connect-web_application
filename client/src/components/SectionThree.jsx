import React from "react";
import "./SectionThree.css";
import mapImage from "../image/map.png"; 

function SectionThree() {
  return (
    <div className="section-three">

       {/* Left side: image */}
      <div className="section-three-image-wrapper">
        <img src={mapImage} alt="Map Feature" className="section-three-image" />
      </div>

      {/* Right: text content */}
      <div className="section-three-text">
        <h2 className="section-three-title">Map Features</h2>
        <p className="section-three-subtitle">
          Explore the network of students and find your community.
        </p>
      </div>

    </div>
  );
}

export default SectionThree;
