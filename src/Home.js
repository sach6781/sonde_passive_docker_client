import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Import your CSS file


function Home() {
  const navigate = useNavigate();


  const redirectToAnother = () => {
    navigate('/dashboard');
  };

  const redirectToEnrollment = () => {
    navigate('/enrollment');
  }

  return (
    <div>
      <h1>Welcome to the Home page!</h1>

      <div >
        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <Link style={{ textDecoration: 'none', color: 'white'}} to="/dashboard">Dashboard</Link>
          </h1>

        </div>

        <br>
        </br>

        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <Link style={{ textDecoration: 'none', color: 'white'}} to="/enrollment">Enrollment</Link>
          </h1>

        </div>

      </div>
    </div>
  );
}

export default Home;
