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
      <h2> Welcome to Sonde Mental Fitness </h2>
      <h2> Multi-user Verification </h2>
      <h2> Passive Demo </h2>

      <div >
        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{padding: "30px", margin: "12px", position: 'absolute', left: '40%',   transform: 'translate(-50%, -40%)'}}>
          <Link style={{ textDecoration: 'none', color: 'white', fontSize: '20px'}} to="/dashboard">Dashboard</Link>
          </h1>

        </div>

        <br>
        </br>

        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "15px", color: "#b2dfee" }}>
          <h1 style={{ padding: "4px", margin: "12px", position: 'absolute', left: '40%', transform: 'translate(-50%, -40%)'}}>
          <Link style={{ textDecoration: 'none', color: 'white', fontSize: '20px'}} to="/mental_fitness">Single User Mode</Link>
          </h1>

        </div>

        <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{ padding: "30px", margin: "12px", position: 'absolute', left: '40%', transform: 'translate(-50%, -40%)'}}>
          <Link style={{ textDecoration: 'none', color: 'white', fontSize: '20px'}} to="/enrollment">Enrollment</Link>
          </h1>

        </div>



        {/* <div style={{ border: "1.5px solid #30A7FF", position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', width: "30%", height: "10%", backgroundColor: "#00344E", borderRadius: "15px", padding: "13px", color: "#b2dfee" }}>
          <h1 style={{ padding: "20px", margin: "15px", position: 'absolute', left: '40%', transform: 'translate(-50%, -40%)'}}>
          <Link style={{ textDecoration: 'none', color: 'white', fontSize: '20px'}} to="/test">Test Mode</Link>
          </h1>

        </div> */}

      </div>
    </div>
  );
}

export default Home;
