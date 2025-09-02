import React from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  return (
    <div>
      <h1>Patient Dashboard</h1>
      <p>Welcome, Patient! Here's your dashboard.</p>
      <Link to="/predict">
        <button>Start a Disease Prediction</button>
      </Link>
    </div>
  );
};

export default PatientDashboard;
