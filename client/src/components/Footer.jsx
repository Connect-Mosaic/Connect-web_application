import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import FacebookIcon from "../image/fb.png";
import LinkedInIcon from "../image/in.png";
import InstagramIcon from "../image/ins.png";


function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">

      {/* Left: Connect button */}
      <div className="footer-left">
        <button className="footer-connect-btn">
          Connect
        </button>
      </div>

      {/* Center: Navigation text */}
      <div className="footer-center">
        <span
          className="footer-link clickable"
          onClick={() => navigate("/")}
        >
          Home
        </span>

        <span
          className="footer-link clickable"
          onClick={() => navigate("/about")}
        >
          About
        </span>

        <span
          className="footer-link clickable"
          onClick={() => navigate("/resources")}
        >
          Resources
        </span>
      </div>

      {/* Right: Social icons */}
      <div className="footer-right">
        <img src={FacebookIcon} alt="Facebook" className="social-icon" />
        <img src={LinkedInIcon} alt="LinkedIn" className="social-icon" />
        <img src={InstagramIcon} alt="Instagram" className="social-icon" />
      </div>

    </footer>
  );
}

export default Footer;
