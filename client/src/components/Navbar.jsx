import React from 'react';
import {NavLink} from "react-router-dom";
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
       {/*logo*/}
      <div className="navbar-brand">
        <h2>Mosaic Connect</h2>
      </div>

      {/*search bar*/}
      <div className="navbar-search">
        <input 
          type="text" 
          placeholder="Search for friends or events..." 
          className="search-input"
        />
      </div>
      
      {/*navigation links*/}
      <div className="navbar-links">
        <NavLink to="/" end className={({isActive}) => isActive ? "nav-link active":"nav-link"}>
          Home
        </NavLink>
        <NavLink to="/events"  className={({isActive}) => isActive ? "nav-link active":"nav-link"}>
          Event
        </NavLink>
        <NavLink to="/chat" className={({isActive}) => isActive ? "nav-link active":"nav-link"}>
          Chat
        </NavLink>
        <NavLink to="/map"  className={({isActive}) => isActive ? "nav-link active":"nav-link"}>
          Map
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;