import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DockerClient from './DockerClient';
import DashBoard from './DashBoard';
import { Link, useNavigate } from 'react-router-dom';
import Home from './Home';
import Enrollment from './Enrollment';
import Recorder from './Recorder';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/recorder" element={<Recorder />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>


    </div>
  );
}

export default App;
