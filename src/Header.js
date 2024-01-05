import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const headerListStyle = {
    display: 'flex',
    justifyContent: 'space-between', // Align links horizontally with space in between
    listStyleType: 'none',
    padding: 3
  };

  const linkStyle = {
    textDecoration: 'none', // Remove underline from links
    color: '#b2dfee', // Customize link color
    padding: 5,
    margin: 5,
    fontSize: '12px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    backgroundColor: '#f0f0f0', // Optional background color for demonstration
    height: '50px', // Adjust the height as needed
  };

  return (
    <header style={headerStyle}>
      <nav style={{ fontSize: '10px', border: "1.5px solid #30A7FF", position: 'absolute', width: "90%", backgroundColor: "#00344E", borderRadius: "15px", padding: "2px", color: "#b2dfee" }}>
        <ul style={headerListStyle} className="header-list">
          <li className="left-link">
            <Link to="/" style={linkStyle}>Home</Link>
          </li>
          <li className="middle-link">
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          </li>
          <li className="right-link">
            <Link to="/enrollment" style={linkStyle}>Enrollment</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
