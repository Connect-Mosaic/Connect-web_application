import React from "react";
import "./SectionTwo.css";
import mkf from "../image/mkf.png";
import je from "../image/je.png";
import bc from "../image/bc.png";

function SectionTwo() {
  return (
    <div className="section-two">

      {/* ---- SECTION HEADER ---- */}
      <div className="section-two-header">
        <h2 className="section-two-title">What We Offer</h2>
        <p className="section-two-subtitle">
          Discover how Mosaic Connect helps students find community.
        </p>
      </div>

      {/* ---- FEATURE CARDS ---- */}
      <div className="feature-wrapper">

        <div className="feature-card">
          <img src={mkf} alt="Matching feature" className="feature-image" />
          <h3 className="feature-title">Matched by Interest</h3>
          <p className="feature-text">Find peers who share the same passions.</p>
        </div>

        <div className="feature-card">
          <img src={je} alt="Event feature" className="feature-image" />
          <h3 className="feature-title">Event Based</h3>
          <p className="feature-text">Explore events tailored for university students.</p>
        </div>

        <div className="feature-card">
          <img src={bc} alt="Connect feature" className="feature-image" />
          <h3 className="feature-title">Build Connections</h3>
          <p className="feature-text">Expand your circle and discover communities.</p>
        </div>

      </div>

    </div>
  );
}

export default SectionTwo;
