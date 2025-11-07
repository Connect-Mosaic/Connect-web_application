import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Mosaic Connect</h2>
      </div>
      
      <div className="navbar-search">
        <input 
          type="text" 
          placeholder="Search for friends or events..." 
          className="search-input"
        />
      </div>
      
      <div className="navbar-icons">
        <button className="icon-button">🏠</button>
        <button className="icon-button">💬</button>
        <button className="icon-button">🔔</button>
        <button className="icon-button">👤</button>
      </div>
    </nav>
  );
}

export default Navbar;