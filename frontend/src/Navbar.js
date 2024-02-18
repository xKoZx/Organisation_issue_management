import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-title">CRYSTAL AI</Link>
        <ul className="navbar-items">
          <li className="navbar-item"><Link to="/home">About Us</Link></li>
          <li className="navbar-item"><Link to="/home">Report Now</Link></li>
          <li className="navbar-item"><Link to="/logout">Logout</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
