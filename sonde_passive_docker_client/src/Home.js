import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Import your CSS file

  
function Home() {
  const navigate = useNavigate();


  const redirectToAnother = () => {
    navigate('/dashboard');
  };

  const redirectToEnrollment =() => {
    navigate('/enrollment');
  }

  return (
    <div>
      <h1>Welcome to the Home page!</h1>

      <Link to="/dashboard">Go to Dashboard Component</Link>
      <br></br>
      <button onClick={redirectToAnother}>Go to Dashboard Component </button>
      <button onClick={redirectToEnrollment}>Go to Enrollment Component </button>
    </div>
  );
}

export default Home;
