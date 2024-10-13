import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Login from './Login';
import AdminLogin from './AdminLogin';
import SignUp from './SignUp';
import VoterDashboard from './VoterDashboard';
import ElectionCommissionDashboard from './ElectionComissionDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/voter-dashboard" element={<VoterDashboard />} />
        <Route path="/election-commission-dashboard" element={<ElectionCommissionDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

