import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Enrollment() {

    const navigate = useNavigate();

    const redirectToRecorder =() => {
        navigate('/recorder');
      }

  return (
    <div>
       <h1>
            This is Enrollment File.
       </h1>
       <button onClick={redirectToRecorder}>Go to Recording Component </button>
    </div>
  );
}

export default Enrollment;
