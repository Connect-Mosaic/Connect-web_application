import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; 
import MosaicImage from "../image/Mosaic.png";
import SectionTwo from "../components/SectionTwo";
import SectionThree from "../components/SectionThree";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>

      {/* HERO SECTION */}
      <div className="homepage">
        {/* Left side: text and buttons */}
        <div className="homepage-text">
          <h1 className="homepage-title">Mosaic Connect</h1>
          <p className="homepage-subtitle">
            Connecting College/University students based on interests.
          </p>

          <div className="homepage-buttons">
            <button
              className="btn btn-dark me-3"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right section: Display your image */}
        <div className="homepage-image">
          <img src={MosaicImage} alt="Mosaic Connect illustration" />
        </div>
      </div>
      {/* END HERO SECTION */}

      {/* SECTION After */}
      <SectionTwo />
      <SectionThree />

    </div>
  );
}

export default HomePage;
