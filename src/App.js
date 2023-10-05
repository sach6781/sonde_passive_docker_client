import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import DashBoard from './DashBoard';
import Home from './Home';
import Enrollment from './Enrollment';
import Recorder from './Recorder';
import MentalFitness from './MentalFitness';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/recorder" element={<Recorder />} />
        <Route path="/mental_fitness" element={<MentalFitness />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>

    </div>
  );
}

export default App;
