import React from 'react';
import './styles/Navbar.css';

const Navbar = ({ isLoggedIn, onLoginClick, onLogoutClick }) => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Student App</h2>
      {!isLoggedIn ? (
        <button className="navbar-btn" onClick={onLoginClick}>Login</button>
      ) : (
        <div className="logged-in-container">
          <span className="logged-message">Logged in</span>
          <button className="navbar-btn" onClick={onLogoutClick}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
